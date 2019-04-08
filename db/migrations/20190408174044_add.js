exports.up = function(knex, Promise) {
    knex.schema.createTable('users', function (table) {
        table.increments();
        table.string('name').notNullable();
        table.string('tel_no').notNullable();
        table.string('token').notNullable();
        table.foreign('it_chula_id').references('it_chula.it_chula_id')
        table.timestamps();
    });
  };
  
  exports.down = function(knex, Promise) {
    knex.schema.dropTable('users');
  };
  
