exports.up = function(knex, Promise) {
  return knex.schema.table("feedback", function(table) {
    table
      .double("rating")
      .notNull()
      .defaultTo(0.0)
      .alter();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table("feedback", function(table) {
    table
      .dropColumn("rating");
  });
};
