exports.up = function(knex, Promise) {
  return knex.schema.table("feedback", function(table) {
    table
      .string("comment")
      .notNull()
      .defaultTo(" ")
      .alter();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table("feedback", function(table) {
    table
      .dropColumn("comment");
  });
};
