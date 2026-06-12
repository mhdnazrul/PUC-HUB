import knex from 'knex';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import knexConfig from '../knexfile.js';

// Load env variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const db = knex(knexConfig[process.env.NODE_ENV || 'development']);

async function seed() {
  const adminEmail = 'admin@puchub.com';
  const adminPassword = 'AdminPUCHub2026!';
  const adminUsername = 'Admin';
  const adminStudentId = '0000000000000000'; // Unique fallback student ID

  console.log('Seeding default admin user...');

  try {
    // Check if an admin with this email already exists
    const existingUser = await db('users').where({ email: adminEmail }).first();
    if (existingUser) {
      console.log(`Admin user with email ${adminEmail} already exists. No changes made.`);
      return;
    }

    const password_hash = await bcrypt.hash(adminPassword, 12);

    const [user] = await db('users').insert({
      username: adminUsername,
      email: adminEmail,
      student_id: adminStudentId,
      password_hash: password_hash,
      is_admin: true,
      auth_provider: 'local'
    }).returning('*');

    await db('profiles').insert({
      user_id: user.id,
      email: adminEmail,
      completed: true
    });

    console.log(`Admin user seeded successfully. Email: ${adminEmail}, User ID: ${user.id}`);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

seed();
