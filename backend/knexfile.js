import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

/**
 * Returns a Knex-compatible connection config.
 * For cloud Supabase (non-localhost), SSL is enabled without cert verification
 * (required by Supabase's pooler).
 */
const getConnectionConfig = (dbUrl) => {
  if (!dbUrl) return undefined;
  const isLocal = dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1');
  return {
    connectionString: dbUrl,
    ssl: isLocal ? false : { rejectUnauthorized: false }
  };
};

/**
 * Migration environment (development): uses DIRECT_URL (session-mode pooler on port 5432)
 * which supports DDL statements. Falls back to DATABASE_URL, then localhost.
 *
 * Runtime environment (production): uses DATABASE_URL (transaction-mode pooler on port 6543).
 * Pool min=0 is important for transaction poolers — pgBouncer resets connections after
 * each transaction so a min>0 idle pool causes stale-connection errors.
 */
export default {
  development: {
    client: 'pg',
    connection: getConnectionConfig(
      process.env.DIRECT_URL ||
      process.env.DATABASE_URL ||
      'postgresql://postgres:postgres@localhost:5432/puc_hub'
    ),
    pool: { min: 0, max: 5 },
    migrations: {
      directory: './migrations',
      tableName: 'knex_migrations'
    }
  },

  staging: {
    client: 'pg',
    connection: getConnectionConfig(process.env.DATABASE_URL),
    pool: { min: 0, max: 10 },
    migrations: {
      directory: './migrations',
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'pg',
    connection: getConnectionConfig(
      process.env.DIRECT_URL || process.env.DATABASE_URL
    ),
    pool: {
      min: 0,        // Do NOT keep idle connections — transaction pooler drops them anyway
      max: 10,
      createTimeoutMillis: 30000,
      acquireTimeoutMillis: 30000,
      idleTimeoutMillis:  30000
    },
    migrations: {
      directory: './migrations',
      tableName: 'knex_migrations'
    }
  }
};
