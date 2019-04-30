exports.up = function(knex, Promise) {
  return knex.schema.table("request", function(table) {
    table
      .integer("aid")
      .notNull()
      .unsigned()
      .references("accounts.aid");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table("request", function(table) {
    table
      .dropColumn("aid");
  });
};
