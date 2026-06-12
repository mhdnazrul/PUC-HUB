import knex from 'knex';
import knexConfig from '../knexfile.js';

// Single shared Knex connection pool for the entire application.
// Importing this module multiple times returns the same instance (Node module cache).
const db = knex(knexConfig[process.env.NODE_ENV || 'development']);

export default db;
