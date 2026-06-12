import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { logger } from '../utils/logger.js';
import db from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-insecure-secret';
const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

export const register = async (req, res) => {
  const { student_id, username, password } = req.body;

  if (!student_id || !username || !password) {
    return res.status(400).json({ success: false, message: 'student_id, username, and password are required.' });
  }
  if (student_id.length !== 16 || !/^\d+$/.test(student_id)) {
    return res.status(400).json({ success: false, message: 'Student ID must be exactly 16 digits.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
  }

  try {
    const existing = await db('users').where({ student_id }).whereNull('deleted_at').first();
    if (existing) {
      return res.status(409).json({ success: false, message: 'Student ID already registered.' });
    }

    const password_hash = await bcrypt.hash(password, 12);
    const [user] = await db('users')
      .insert({ username, student_id, password_hash, auth_provider: 'local' })
      .returning(['id', 'username', 'student_id', 'is_admin']);

    await db('profiles').insert({ user_id: user.id });

    logger.info('New user registered', { userId: user.id, traceId: req.traceId });
    res.status(201).json({ success: true, message: 'Account created successfully.', user });
  } catch (error) {
    logger.error('Registration error', { traceId: req.traceId, error: error.message });
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const login = async (req, res) => {
  const { student_id, password } = req.body;

  if (!student_id || !password) {
    return res.status(400).json({ success: false, message: 'student_id and password are required.' });
  }

  try {
    const user = await db('users').where({ student_id }).whereNull('deleted_at').first();
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    if (user.is_blocked) {
      return res.status(403).json({ success: false, message: 'Your account has been suspended.' });
    }

    await db('users').where({ id: user.id }).update({ last_login: new Date() });

    const accessToken = jwt.sign(
      { userId: user.id, isAdmin: user.is_admin },
      JWT_SECRET,
      { expiresIn: '15m' }
    );
    const refreshToken = crypto.randomBytes(40).toString('hex');
    const tokenHash = hashToken(refreshToken);

    await db('refresh_tokens').insert({
      user_id: user.id,
      token_hash: tokenHash,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    res.cookie('jid', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/v1/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    logger.info('User logged in', { userId: user.id, traceId: req.traceId });
    res.status(200).json({
      success: true,
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        student_id: user.student_id,
        is_admin: user.is_admin
      }
    });
  } catch (error) {
    logger.error('Login error', { traceId: req.traceId, error: error.message });
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const refresh = async (req, res) => {
  const refreshToken = req.cookies.jid;
  if (!refreshToken) {
    return res.status(401).json({ success: false, message: 'No refresh token provided.' });
  }

  const tokenHash = hashToken(refreshToken);
  try {
    const existingToken = await db('refresh_tokens').where({ token_hash: tokenHash }).first();
    if (!existingToken) {
      return res.status(401).json({ success: false, message: 'Invalid or expired refresh token.' });
    }

    if (existingToken.is_revoked) {
      await db('refresh_tokens').where({ user_id: existingToken.user_id }).update({ is_revoked: true });
      logger.warn('Refresh token reuse detected — revoking entire session family.', {
        userId: existingToken.user_id,
        traceId: req.traceId
      });
      res.clearCookie('jid');
      return res.status(403).json({
        success: false,
        error_code: 'TOKEN_REUSE_DETECTED',
        message: 'Session compromised. Please log in again.'
      });
    }

    if (new Date() > new Date(existingToken.expires_at)) {
      return res.status(401).json({ success: false, message: 'Refresh token has expired.' });
    }

    await db('refresh_tokens').where({ id: existingToken.id }).update({ is_revoked: true });

    const newAccessToken = jwt.sign(
      { userId: existingToken.user_id },
      JWT_SECRET,
      { expiresIn: '15m' }
    );
    const newRefreshToken = crypto.randomBytes(40).toString('hex');
    const newHash = hashToken(newRefreshToken);

    await db('refresh_tokens').insert({
      user_id: existingToken.user_id,
      token_hash: newHash,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    res.cookie('jid', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/v1/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({ success: true, accessToken: newAccessToken });
  } catch (error) {
    logger.error('Token refresh error', { traceId: req.traceId, error: error.message });
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

export const logout = async (req, res) => {
  const refreshToken = req.cookies.jid;
  if (refreshToken) {
    const tokenHash = hashToken(refreshToken);
    try {
      await db('refresh_tokens').where({ token_hash: tokenHash }).update({ is_revoked: true });
    } catch (error) {
      logger.error('Logout token revocation error', { traceId: req.traceId, error: error.message });
    }
  }
  res.clearCookie('jid', { path: '/api/v1/auth/refresh' });
  res.status(200).json({ success: true, message: 'Logged out successfully.' });
};
