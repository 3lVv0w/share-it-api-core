
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function (table) {
    table.increments('id')
      .notNull()
      .unsigned()
      .primary();
    table.string('it_chula_id').notNull()
    table.string('password').notNull();
    table.string('name').notNull();
    table.dateTime('createdAt').notNull().defaultTo(knex.fn.now());
    table.dateTime('updatedAt').notNull().defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
