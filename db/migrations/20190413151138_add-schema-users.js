
exports.up = function(knex, Promise) {
    return knex.schema.table('items', function (table) {

        table.integer('uid').notNull().unsigned().references('users.uid');; 
       
    });
    
};

exports.down = function(knex, Promise) {
    return knex.schema.table('items', function (table) {
        table.dropColumn('uid').notNull().unsigned().references('users.uid');;
 
    });
};
