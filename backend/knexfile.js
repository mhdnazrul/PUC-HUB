import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// উইন্ডোজ ও নোড এনভায়রনমেন্টে .env ফাইলের সঠিক পাথ নিশ্চিত করার জন্য
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

// ডেটাবেজ কানেকশন কনফিগারেশন জেনারেট করার জন্য হেল্পার ফাংশন
const getConnectionConfig = (dbUrl) => {
  if (!dbUrl) return undefined;

  // Localhost বা 127.0.0.1 হলে SSL প্রয়োজন নেই
  const isLocal = dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1');

  return {
    connectionString: dbUrl,
    ssl: isLocal ? false : { rejectUnauthorized: false }
  };
};

export default {
  development: {
    client: 'pg',
    connection: getConnectionConfig(process.env.DIRECT_URL || process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/puc_hub'),
    migrations: {
      directory: './migrations',
      tableName: 'knex_migrations'
    }
  },
  staging: {
    client: 'pg',
    connection: getConnectionConfig(process.env.DATABASE_URL),
    pool: { min: 2, max: 10 },
    migrations: {
      directory: './migrations',
      tableName: 'knex_migrations'
    }
  },
  production: {
    client: 'pg',
    connection: getConnectionConfig(process.env.DIRECT_URL || process.env.DATABASE_URL),
    pool: {
      min: 2,
      max: 20,
      createTimeoutMillis: 30000,
      acquireTimeoutMillis: 30000,
      idleTimeoutMillis: 30000
    },
    migrations: {
      directory: './migrations',
      tableName: 'knex_migrations'
    }
  }
};
