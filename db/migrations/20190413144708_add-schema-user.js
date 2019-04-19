
exports.up = function(knex, Promise) {
    return knex.schema.table('feedback', function (table) {
        
        table.integer('taid').notNull().unsigned().references('accounts.aid'); 
        table.integer('faid').notNull().unsigned().references('accounts.aid'); 
     
    });
    
};

exports.down = function(knex, Promise) {
    return knex.schema.table('feedback', function (table) {
        table.dropColumn('taid').notNull().unsigned().references('accounts.aid');;
        table.dropColumn('faid').notNull().unsigned().references('accounts.aid');
        
    });
};
