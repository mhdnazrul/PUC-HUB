import express from 'express';
import db from '../db.js';
import { verifyJWT, requireAdmin } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// All admin routes require a valid JWT + admin role
router.use(verifyJWT, requireAdmin);

// ── GET /api/v1/admin/users ───────────────────────────────────────────────────
// List all users (paginated, searchable)
router.get('/admin/users', async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const search = req.query.search || '';
    const offset = (page - 1) * limit;

    let query = db('users')
      .select('id', 'username', 'student_id', 'email', 'is_admin', 'is_blocked',
              'auth_provider', 'last_login', 'created_at', 'deleted_at')
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);

    if (search) {
      query = query.where(function () {
        this.whereILike('username', `%${search}%`)
          .orWhereILike('student_id', `%${search}%`)
          .orWhereILike('email', `%${search}%`);
      });
    }

    const [users, [{ count }]] = await Promise.all([
      query,
      db('users').count('id as count')
    ]);

    res.json({
      success: true,
      data: users,
      pagination: { page, limit, total: parseInt(count) }
    });
  } catch (error) {
    logger.error('Admin: list users error', { error: error.message, traceId: req.traceId });
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// ── GET /api/v1/admin/users/:id ───────────────────────────────────────────────
router.get('/admin/users/:id', async (req, res) => {
  try {
    const user = await db('users')
      .select('id', 'username', 'student_id', 'email', 'is_admin', 'is_blocked',
              'auth_provider', 'admin_notes', 'last_login', 'created_at', 'deleted_at')
      .where({ id: req.params.id })
      .first();

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    logger.error('Admin: get user error', { error: error.message, traceId: req.traceId });
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// ── PATCH /api/v1/admin/users/:id/block ──────────────────────────────────────
router.patch('/admin/users/:id/block', async (req, res) => {
  try {
    const { blocked } = req.body;
    if (typeof blocked !== 'boolean') {
      return res.status(400).json({ success: false, message: '"blocked" must be a boolean.' });
    }

    // Prevent admin from blocking themselves
    if (req.params.id === req.user.userId) {
      return res.status(400).json({ success: false, message: 'You cannot block yourself.' });
    }

    await db('users').where({ id: req.params.id }).update({ is_blocked: blocked });

    logger.info(`Admin: user ${blocked ? 'blocked' : 'unblocked'}`, {
      targetUser: req.params.id,
      adminId: req.user.userId,
      traceId: req.traceId
    });

    res.json({ success: true, message: `User ${blocked ? 'blocked' : 'unblocked'} successfully.` });
  } catch (error) {
    logger.error('Admin: block user error', { error: error.message, traceId: req.traceId });
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// ── PATCH /api/v1/admin/users/:id/promote ────────────────────────────────────
router.patch('/admin/users/:id/promote', async (req, res) => {
  try {
    const { is_admin } = req.body;
    if (typeof is_admin !== 'boolean') {
      return res.status(400).json({ success: false, message: '"is_admin" must be a boolean.' });
    }

    if (req.params.id === req.user.userId) {
      return res.status(400).json({ success: false, message: 'You cannot change your own admin status.' });
    }

    await db('users').where({ id: req.params.id }).update({ is_admin });

    logger.info(`Admin: user ${is_admin ? 'promoted to admin' : 'demoted from admin'}`, {
      targetUser: req.params.id,
      adminId: req.user.userId,
      traceId: req.traceId
    });

    res.json({ success: true, message: `User ${is_admin ? 'promoted to admin' : 'demoted'} successfully.` });
  } catch (error) {
    logger.error('Admin: promote user error', { error: error.message, traceId: req.traceId });
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// ── PATCH /api/v1/admin/users/:id/notes ──────────────────────────────────────
router.patch('/admin/users/:id/notes', async (req, res) => {
  try {
    const { admin_notes } = req.body;
    await db('users').where({ id: req.params.id }).update({ admin_notes: admin_notes || null });
    res.json({ success: true, message: 'Admin notes updated.' });
  } catch (error) {
    logger.error('Admin: update notes error', { error: error.message, traceId: req.traceId });
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// ── DELETE /api/v1/admin/users/:id ───────────────────────────────────────────
// Soft-delete a user (sets deleted_at)
router.delete('/admin/users/:id', async (req, res) => {
  try {
    if (req.params.id === req.user.userId) {
      return res.status(400).json({ success: false, message: 'You cannot delete yourself.' });
    }

    await db('users').where({ id: req.params.id }).update({ deleted_at: new Date() });

    logger.info('Admin: user soft-deleted', {
      targetUser: req.params.id,
      adminId: req.user.userId,
      traceId: req.traceId
    });

    res.json({ success: true, message: 'User deleted successfully.' });
  } catch (error) {
    logger.error('Admin: delete user error', { error: error.message, traceId: req.traceId });
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// ── GET /api/v1/admin/stats ───────────────────────────────────────────────────
router.get('/admin/stats', async (req, res) => {
  try {
    const [
      [{ total_users }],
      [{ active_users }],
      [{ blocked_users }],
      [{ admin_count }],
      [{ total_posts }]
    ] = await Promise.all([
      db('users').count('id as total_users'),
      db('users').whereNull('deleted_at').whereNull('is_blocked').count('id as active_users'),
      db('users').where({ is_blocked: true }).count('id as blocked_users'),
      db('users').where({ is_admin: true }).count('id as admin_count'),
      db('posts').whereNull('deleted_at').count('id as total_posts')
    ]);

    res.json({
      success: true,
      data: {
        total_users:  parseInt(total_users),
        active_users: parseInt(active_users),
        blocked_users: parseInt(blocked_users),
        admin_count:  parseInt(admin_count),
        total_posts:  parseInt(total_posts)
      }
    });
  } catch (error) {
    logger.error('Admin: stats error', { error: error.message, traceId: req.traceId });
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

export default router;
