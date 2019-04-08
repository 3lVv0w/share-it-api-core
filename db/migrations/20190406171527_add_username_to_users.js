
exports.up = function(knex, Promise) {
    knex.schema.addColumn('it_chula', function (table) {
        table.increments();
        table.string('it_chula_id').notnullable().primary();
        table.string('password').notnullable();
        table.string('name').notnullable();
        table.timestamps();
    });
};

exports.down = function(knex, Promise) {
    knex.schema.dropColumn('it_chula', function (table) {
        table.increments();
        table.string('it_chula_id').notnullable().primary();
        table.string('password').notnullable();
        table.string('name').notnullable();
        table.timestamps();
    });
  
};
