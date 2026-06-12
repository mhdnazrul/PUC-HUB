export const up = function (knex) {
  return knex.schema.alterTable('users', (table) => {
    // Make student_id and password_hash nullable to support Google signup
    table.string('student_id', 20).nullable().alter();
    table.string('password_hash', 255).nullable().alter();

    table.string('email', 255).nullable().unique();
    table.string('google_id', 255).nullable().unique();
    table.string('auth_provider', 50).defaultTo('local').notNullable();
  });
};

export const down = function (knex) {
  return knex.schema.alterTable('users', (table) => {
    table.string('student_id', 20).notNullable().alter();
    table.string('password_hash', 255).notNullable().alter();
    
    table.dropColumn('email');
    table.dropColumn('google_id');
    table.dropColumn('auth_provider');
  });
};
