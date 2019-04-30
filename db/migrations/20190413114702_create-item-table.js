exports.up = function(knex, Promise) {
  return knex.schema.createTable('items', function (table) {
    table.increments('iid')
      .notNull()
      .unsigned()
      .primary();
    table.string('item_name').notNull();
    table.string('item_type').notNull();
    table.string('item_qrcode').notNull();
    table.dateTime('createdAt').notNull().defaultTo(knex.fn.now());
    table.dateTime('updatedAt').notNull().defaultTo(knex.fn.now());
    table.string('image').notNull();
    // table.foreign('uid').references('users.uid');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('items');
};
