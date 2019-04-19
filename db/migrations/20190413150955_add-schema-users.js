
exports.up = function(knex, Promise) {
    return knex.schema.table('accounts', function (table) {

        table.integer('cuid').notNull().unsigned().references('temp_it_chula.cuid'); 
       
    });
    
};

exports.down = function(knex, Promise) {
    return knex.schema.table('users', function (table) {
        table.dropColumn('cuid').notNull().unsigned().references('temp_it_chula.cuid');
 
    });
};
