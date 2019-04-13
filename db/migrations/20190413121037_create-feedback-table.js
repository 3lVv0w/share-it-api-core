exports.up = function(knex, Promise) {
    return knex.schema.createTable('feedback', function (table) {
      table.increments('fid')
        .notNull()
        .unsigned()
        .primary();
      table.string('comment');
      table.integer('avd_rating').notNull().defaultTo(0);
      table.integer('no_of_comment').notNull().defaultTo(0);
      table.dateTime('createdAt').notNull().defaultTo(knex.fn.now());
      table.dateTime('updatedAt').notNull().defaultTo(knex.fn.now());
     // table.foreign('uid').references('users.uid'); 
     // table.foreign('sid').references('session.sid'); 
    });
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTable('feedback');
  };

