
exports.up = function(knex, Promise) {
  return knex.schema.createTable('accounts', function (table) {
    table.increments('aid')
      .notNull()
      .unsigned()
      .primary();
    table.integer('token').notNull().defaultTo(100);
    table.string('tel_no').notNull();
    table.string('qrcode').notNull();
    table.string('password').notNull();
    table.string('first_name').notNull();
    table.string('last_name').notNull();
    table.string('email').notNull();
    table.integer('no_of_feedback').notNull().defaultTo(0);
    table.double('avg_rating').notNull().defaultTo(0.0);
    table.dateTime('createdAt').notNull().defaultTo(knex.fn.now());
    table.dateTime('updatedAt').notNull().defaultTo(knex.fn.now());
    table.boolean('in_session').notNull().defaultTo(false);
    table.string('image').notNull();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('accounts');
};
