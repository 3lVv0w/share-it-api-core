exports.up = function(knex, Promise) {
    return knex.schema.table('session', function (table) { 
        table.integer('iid').notNull().unsigned().references('items.iid'); 
        table.integer('aid').notNull().unsigned().references('accounts.aid'); 
        table.integer('rid').notNull().unsigned().references('request.rid'); 
     
    });
    
};

exports.down = function(knex, Promise) {
    return knex.schema.table('session', function (table) {
        table.dropColumn('iid').notNull().unsigned().references('items.iid'); 
        table.dropColumn('aid').notNull().unsigned().references('accounts.aid');
        table.dropColumn('rid').notNull().unsigned().references('request.rid');
        
    });
};

