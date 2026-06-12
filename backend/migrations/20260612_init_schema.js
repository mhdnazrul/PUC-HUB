export const up = function (knex) {
  return knex.schema
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .createTable('users', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.string('username', 100).notNullable();
      table.string('student_id', 20).notNullable().unique();
      table.string('password_hash', 255).notNullable();
      table.boolean('is_admin').defaultTo(false);
      table.boolean('is_blocked').defaultTo(false);
      table.timestamps(true, true);
      table.timestamp('last_login');
      table.timestamp('deleted_at').nullable(); // Soft delete flag
      
      // Index for soft delete queries
      table.index(['deleted_at']);
    })
    .createTable('profiles', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE').unique();
      table.string('department', 100);
      table.string('semester', 20);
      table.string('section', 10);
      table.string('blood_group', 5);
      table.string('advisor', 100);
      table.string('phone', 30);
      table.string('email', 255);
      table.text('profile_image');
      table.boolean('completed').defaultTo(false);
      table.timestamps(true, true);
    })
    .createTable('posts', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
      table.string('type', 30).notNullable(); // housing, study_partner, book_sell
      table.string('category', 50);
      table.string('title', 255).notNullable();
      table.text('content');
      table.decimal('price', 10, 2);
      table.date('available_from');
      table.text('file_url');
      table.timestamps(true, true);
      table.timestamp('deleted_at').nullable(); // Soft delete flag

      table.index(['type', 'category']);
      table.index(['deleted_at']);
    });
};

export const down = function (knex) {
  return knex.schema
    .dropTableIfExists('posts')
    .dropTableIfExists('profiles')
    .dropTableIfExists('users');
};
