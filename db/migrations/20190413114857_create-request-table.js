
exports.up = function(knex, Promise) {
    return knex.schema.createTable('request', function (table) {
      table.increments('rid')
        .notNull()
        .unsigned()
        .primary();
      table.string('describe').notNull();
      table.string('type').notNull();
      table.string('token').notNull();
      table.string('location').notNull();
      table.integer('duration').notNull();
      table.dateTime('timeout').notNull();
      table.string('status').notNull(); 
      table.dateTime('createdAt').notNull().defaultTo(knex.fn.now());
      table.dateTime('updatedAt').notNull().defaultTo(knex.fn.now());
      //table.foreign('uid').references('users.uid');   
    });
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTable('request');
  };