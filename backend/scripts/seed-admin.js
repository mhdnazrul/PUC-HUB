/**
 * seed-admin.js
 *
 * Creates an admin user in the database.
 * Uses credentials from .env (ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_STUDENT_ID, ADMIN_USERNAME).
 * Falls back to safe defaults if env vars are not set.
 *
 * Run with: node scripts/seed-admin.js
 *
 * NOTE: knexfile.js itself calls dotenv.config() at module evaluation time (ES Module
 * static imports are hoisted), so environment variables are available before we call
 * dotenv.config() here. The call below is kept as an explicit safety net.
 */
import knex from 'knex';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import knexConfig from '../knexfile.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const env = process.env.NODE_ENV || 'development';
const db  = knex(knexConfig[env]);

async function seed() {
  const adminEmail     = process.env.ADMIN_EMAIL      || 'admin@puchub.com';
  const adminPassword  = process.env.ADMIN_PASSWORD   || 'AdminPUCHub2026!';
  const adminUsername  = process.env.ADMIN_USERNAME   || 'Admin';
  const adminStudentId = process.env.ADMIN_STUDENT_ID || '0000000000000000';

  console.log(`\n🌱 Seeding admin user (env: ${env})…`);
  console.log(`   Email:     ${adminEmail}`);
  console.log(`   StudentID: ${adminStudentId}\n`);

  try {
    // Idempotent: skip if admin already exists (matched by email or student_id)
    const existing = await db('users')
      .where(function () {
        this.where({ email: adminEmail }).orWhere({ student_id: adminStudentId });
      })
      .first();

    if (existing) {
      console.log(`✅ Admin already exists (ID: ${existing.id}). No changes made.`);
      return;
    }

    const password_hash = await bcrypt.hash(adminPassword, 12);

    const [user] = await db('users').insert({
      username:     adminUsername,
      email:        adminEmail,
      student_id:   adminStudentId,
      password_hash,
      is_admin:     true,
      auth_provider: 'local'
    }).returning('*');

    // Create a matching profile row
    await db('profiles').insert({
      user_id:   user.id,
      email:     adminEmail,
      completed: true
    });

    console.log(`🎉 Admin seeded successfully!`);
    console.log(`   User ID:  ${user.id}`);
    console.log(`   Email:    ${adminEmail}`);
    console.log(`   Password: (from ADMIN_PASSWORD env var)\n`);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

seed();
