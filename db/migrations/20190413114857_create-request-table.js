exports.up = function(knex, Promise) {
  return knex.schema.createTable("request", function(table) {
    table
      .increments("rid")
      .notNull()
      .unsigned()
      .primary();
    table.string("note").notNull();
    table.string("item_name").notNull();
    table.string("item_type").notNull();
    table.integer("token_used").notNull();
    table.string("k_location").notNull();
    table.dateTime("borrow_time").notNull();
    table.dateTime("return_time").notNull();
    table
      .string("l_status")
      .notNull()
      .defaultTo(false);
    table
      .dateTime("createdAt")
      .notNull()
      .defaultTo(knex.fn.now());
    table
      .dateTime("updatedAt")
      .notNull()
      .defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("request");
};
