exports.up = function(knex, Promise) {
  return knex.schema.table("accounts", function(table) {
    table
      .string("image")
      .notNull()
      .defaultTo(
        "https://firebasestorage.googleapis.com/v0/b/shareit-60e65.appspot.com/o/profile.png?alt=media&token=297c1341-5c7d-4b1e-902b-2a98e4951f52"
      )
      .alter();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table("accounts", function(table) {
    table
      .dropColumn("image");
  });
};
