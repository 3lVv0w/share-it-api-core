exports.up = function(knex, Promise) {
    return knex.schema.table('session', function (table) { 
        table.integer('iid').notNull().unsigned().references('items.iid'); 
        table.integer('uid').notNull().unsigned().references('users.uid'); 
        table.integer('rid').notNull().unsigned().references('request.rid'); 
     
    });
    
};

exports.down = function(knex, Promise) {
    return knex.schema.table('session', function (table) {
        table.dropColumn('iid').notNull().unsigned().references('items.iid'); 
        table.dropColumn('uid').notNull().unsigned().references('users.uid');
        table.dropColumn('rid').notNull().unsigned().references('request.rid');
        
    });
};

