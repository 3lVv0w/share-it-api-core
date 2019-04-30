exports.up = function(knex, Promise) {
  return knex.schema.table("accounts", function(table) {
    table
      .double("avg_rating")
      .notNull()
      .defaultTo(0.0)
      .alter();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table("accounts", function(table) {
    table
      .dropColumn("avg_rating");
  });
};
