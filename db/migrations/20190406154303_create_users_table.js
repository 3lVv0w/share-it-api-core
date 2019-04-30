
exports.up = function(knex, Promise) {
  return knex.schema.createTable('temp_it_chula', function (table) {
    table.string('it_chula').notNull().primary()
    table.string('first_name').notNull();
    table.string('last_name').notNull();
    table.dateTime('createdAt').notNull().defaultTo(knex.fn.now());
    table.dateTime('updatedAt').notNull().defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('temp_it_chula');
};
