export const up = function (knex) {
  return knex.schema.createTable('refresh_tokens', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('token_hash', 255).notNullable().unique();
    table.boolean('is_revoked').defaultTo(false);
    table.timestamp('expires_at').notNullable();
    table.timestamps(true, true);
    
    table.index(['token_hash']);
  });
};

export const down = function (knex) {
  return knex.schema.dropTableIfExists('refresh_tokens');
};
