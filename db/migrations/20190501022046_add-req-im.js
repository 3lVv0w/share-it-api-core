exports.up = function(knex, Promise) {
    return knex.schema.table("request", function(table) {
      table
        .string("image")
        .notNull()
        .defaultTo(
          "https://firebasestorage.googleapis.com/v0/b/shareit-60e65.appspot.com/o/logo.png?alt=media&token=b658faa7-d084-4972-9f8d-d2779256a462"
        )
    });
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.table("request", function(table) {
      table
        .dropColumn("image");
    });
  };