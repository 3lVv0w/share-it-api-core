exports.up = function(knex, Promise) {
  return knex.schema.table("request", function(table) {
    table
      .string("borrow_time")
      .notNull()
      .alter();
    table
      .string("return_time")
      .notNull()
      .alter();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table("request", function(table) {
    table
      .dropColumn("borrow_time");
    table
      .dropColumn("return_time");
  });
};
