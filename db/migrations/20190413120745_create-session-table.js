exports.up = function(knex, Promise) {
    return knex.schema.createTable('session', function (table) {
      table.increments('sid')
        .notNull()
        .unsigned()
        .primary();
      table.dateTime('start_time').notNull();
      table.dateTime('end_time').notNull();
      table.string('s_status').notNull().defaultTo(false);
      table.dateTime('createdAt').notNull().defaultTo(knex.fn.now());
      table.dateTime('updatedAt').notNull().defaultTo(knex.fn.now());
      //table.foreign('uid').references('account.aid'); 
      //table.foreign('rid').references('request.rid'); 
      //table.foreign('iid').references('items.iid'); 
     
    });
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTable('session');
  };