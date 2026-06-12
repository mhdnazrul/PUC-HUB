import dotenv from 'dotenv';
dotenv.config();

export default {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/puc_hub',
    migrations: {
      directory: './migrations',
      tableName: 'knex_migrations'
    }
  },
  staging: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: { min: 2, max: 10 },
    migrations: {
      directory: './migrations',
      tableName: 'knex_migrations'
    }
  },
  production: {
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    },
    pool: { min: 2, max: 20 },
    migrations: {
      directory: './migrations',
      tableName: 'knex_migrations'
    }
  }
};
