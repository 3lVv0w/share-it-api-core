exports.up = function(knex, Promise) {
  return knex.schema.table("items", function(table) {
    table
      .integer("belonged_aid")
      .notNull()
      .unsigned()
      .references("accounts.aid");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table("items", function(table) {
    table
      .dropColumn("belonged_aid");
  });
};
