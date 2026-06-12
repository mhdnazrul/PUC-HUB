/**
 * Migration: Add admin_notes to users table for admin moderation
 * The is_admin boolean column already exists from the init_schema migration.
 * This migration adds soft-delete support for profiles and
 * admin_notes for admin moderation on users.
 */
export const up = function (knex) {
  return knex.schema.alterTable('users', (table) => {
    // Admin-facing notes for moderation (optional, e.g. "Banned for spam")
    table.text('admin_notes').nullable();
  });
};

export const down = function (knex) {
  return knex.schema.alterTable('users', (table) => {
    table.dropColumn('admin_notes');
  });
};
