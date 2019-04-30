exports.up = function(knex, Promise) {
  return knex.schema.createTable("feedback", function(table) {
    table
      .increments("fid")
      .notNull()
      .unsigned()
      .primary();
    table.string("comment");
    table.integer("rating").notNull();
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
  return knex.schema.dropTable("feedback");
};
