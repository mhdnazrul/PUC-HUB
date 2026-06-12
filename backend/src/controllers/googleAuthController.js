import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { logger } from '../utils/logger.js';
import db from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-insecure-secret';
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/v1/auth/google/callback';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5500';

export const googleLogin = (_req, res) => {
  if (!CLIENT_ID) {
    return res.status(503).json({ success: false, message: 'Google OAuth is not configured on this server.' });
  }
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: 'openid profile email',
    access_type: 'offline',
    prompt: 'select_account'
  });
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
};

export const googleCallback = async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.redirect(`${FRONTEND_URL}/login.html?error=oauth_missing_code`);
  }

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code'
      })
    });
    const tokenData = await tokenRes.json();
    if (tokenData.error) {
      throw new Error(tokenData.error_description || tokenData.error);
    }

    const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });
    const profile = await userRes.json();
    const { sub: google_id, email, name, picture } = profile;

    if (!google_id || !email) {
      throw new Error('Google profile is missing required fields (sub, email).');
    }

    let user = await db('users').where({ google_id }).whereNull('deleted_at').first();

    if (!user) {
      user = await db('users').where({ email }).whereNull('deleted_at').first();
      if (user) {
        await db('users').where({ id: user.id }).update({ google_id, auth_provider: 'google' });
        logger.info('Linked existing local account to Google', { userId: user.id });
      } else {
        const [newUser] = await db('users')
          .insert({ username: name, email, google_id, auth_provider: 'google', is_admin: false })
          .returning('*');

        await db('profiles').insert({
          user_id: newUser.id,
          email,
          profile_image: picture,
          completed: false
        });

        user = newUser;
        logger.info('New Google user registered', { userId: user.id });
      }
    }

    if (user.is_blocked) {
      return res.redirect(`${FRONTEND_URL}/login.html?error=account_suspended`);
    }

    const accessToken = jwt.sign(
      { userId: user.id, isAdmin: user.is_admin, provider: 'google' },
      JWT_SECRET,
      { expiresIn: '15m' }
    );
    const refreshToken = crypto.randomBytes(40).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    await db('refresh_tokens').insert({
      user_id: user.id,
      token_hash: tokenHash,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    res.cookie('jid', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/api/v1/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.cookie('oauth_handoff', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
      maxAge: 60 * 1000
    });

    res.redirect(`${FRONTEND_URL}/login.html?oauth=success&token=${accessToken}`);
  } catch (error) {
    logger.error('Google OAuth callback error', { error: error.message });
    res.redirect(`${FRONTEND_URL}/login.html?error=oauth_failed`);
  }
};

export const authMe = async (req, res) => {
  // Support taking token from header (bypasses 3P cookie blocks) or fallback to cookie
  const authHeader = req.headers.authorization;
  const handoffToken = (authHeader && authHeader.startsWith('Bearer ')) 
    ? authHeader.split(' ')[1] 
    : req.cookies.oauth_handoff;

  if (!handoffToken) {
    return res.status(401).json({ success: false, message: 'No handoff token found.' });
  }

  res.clearCookie('oauth_handoff', {
    path: '/',
    secure: process.env.NODE_ENV === 'production' ? true : false,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  });

  try {
    const decoded = jwt.verify(handoffToken, JWT_SECRET);
    const user = await db('users').where({ id: decoded.userId }).first();
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found.' });
    }

    const accessToken = jwt.sign(
      { userId: user.id, isAdmin: user.is_admin },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.status(200).json({
      success: true,
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        is_admin: user.is_admin,
        provider: user.auth_provider
      }
    });
  } catch (error) {
    logger.error('Auth handoff error', { error: error.message });
    res.status(401).json({ success: false, message: 'Invalid or expired handoff token.' });
  }
};
