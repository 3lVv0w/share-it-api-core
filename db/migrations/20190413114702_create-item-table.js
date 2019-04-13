exports.up = function(knex, Promise) {
    return knex.schema.createTable('items', function (table) {
      table.increments('iid')
        .notNull()
        .unsigned()
        .primary();
      table.string('name').notNull();
      table.string('type').notNull();
      table.string('qrcode').notNull();
      table.dateTime('createdAt').notNull().defaultTo(knex.fn.now());
      table.dateTime('updatedAt').notNull().defaultTo(knex.fn.now());
     // table.foreign('uid').references('users.uid');  
    });
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTable('items');
  };
