
exports.up = function(knex, Promise) {
  return knex.schema.createTable('it_chula', function (table) {
    table.increments('cuid')
      .notNull()
      .unsigned()
      .primary()
    table.string('it_chula_id').notNull();
    table.string('password').notNull();
    table.string('name').notNull();
    table.dateTime('createdAt').notNull().defaultTo(knex.fn.now());
    table.dateTime('updatedAt').notNull().defaultTo(knex.fn.now());
   
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('it_chula');
};
