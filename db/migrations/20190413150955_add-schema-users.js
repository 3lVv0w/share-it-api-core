exports.up = function(knex, Promise) {
  return knex.schema.table("accounts", function(table) {
    table
      .string("it_chula")
      .notNull()
      .unsigned()
      .references("temp_it_chula.it_chula");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table("accounts", function(table) {
    table
      .dropColumn("it_chula");
  });
};
