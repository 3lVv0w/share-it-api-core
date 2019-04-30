exports.up = function(knex, Promise) {
  return knex.schema.table("session", function(table) {
    table
      .string("start_time")
      .notNull()
      .alter();
    table
      .string("end_time")
      .notNull()
      .alter();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table("session", function(table) {
    table
      .dropColumn("start_time");
    table
      .dropColumn("end_time");
  });
};
