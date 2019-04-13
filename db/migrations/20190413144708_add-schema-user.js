
exports.up = function(knex, Promise) {
    return knex.schema.table('feedback', function (table) {
        
        table.integer('uid').notNull().unsigned().references('users.uid'); 
        table.integer('sid').notNull().unsigned().references('session.sid'); 
     
    });
    
};

exports.down = function(knex, Promise) {
    return knex.schema.table('feedback', function (table) {
        table.dropColumn('uid').notNull().unsigned().references('users.uid');;
        table.dropColumn('sid').notNull().unsigned().references('session.sid');
        
    });
};
