import knex from 'knex';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import knexConfig from '../knexfile.js';

dotenv.config({ path: new URL('../../.env', import.meta.url).pathname });

const db = knex(knexConfig.development);

async function seed() {
  const student_id = process.env.ADMIN_STUDENT_ID;
  const email      = process.env.ADMIN_EMAIL;
  const username   = process.env.ADMIN_USERNAME || 'Admin';
  const password   = process.env.ADMIN_PASSWORD;

  if (!student_id || !email || !password) {
    console.error('ADMIN_STUDENT_ID, ADMIN_EMAIL, and ADMIN_PASSWORD must be set in .env');
    process.exit(1);
  }

  console.log('Seeding admin user...');

  try {
    const existingUser = await db('users').where({ student_id }).first();
    if (existingUser) {
      console.log('Admin user already exists. No changes made.');
      return;
    }

    const password_hash = await bcrypt.hash(password, 12);

    const [user] = await db('users').insert({
      username,
      student_id,
      password_hash,
      email,
      is_admin: true,
      auth_provider: 'local'
    }).returning('*');

    await db('profiles').insert({
      user_id: user.id,
      email,
      completed: true
    });

    console.log('Admin user seeded successfully. User ID:', user.id);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

seed();
