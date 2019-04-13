exports.up = function(knex, Promise) {
    return knex.schema.table('request', function (table) {
     
        table.integer('uid').notNull().unsigned().references('users.uid'); 

     
    });
    
};

exports.down = function(knex, Promise) {
    return knex.schema.table('request', function (table) {
 
        table.dropColumn('uid').notNull().unsigned().references('users.uid');;

        
    });
};
