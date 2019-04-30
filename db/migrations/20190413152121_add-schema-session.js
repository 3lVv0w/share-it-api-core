exports.up = function(knex, Promise) {
  return knex.schema.table("session", function(table) {
    table
      .integer("iid")
      .notNull()
      .unsigned()
      .references("items.iid")
      .defaultTo(0);
    table
      .integer("aid")
      .notNull()
      .unsigned()
      .references("accounts.aid");
    table
      .integer("rid")
      .notNull()
      .unsigned()
      .references("request.rid");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table("session", function(table) {
    table
      .dropColumn("iid");
    table
      .dropColumn("aid");
    table
      .dropColumn("rid");
  });
};
