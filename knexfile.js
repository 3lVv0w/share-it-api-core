module.exports = {
  development: {
    client: 'postgresql',
    connection:{
      database: 'share-it',
      user: 'postgres',
      password: 'postgres',
    },
    pool: { min: 0, max: 7 },
    migrations: {
      tabelName: 'knex_migrations',
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/dev'
    },
    useNullAsDefault: true
  },

  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/production'
    },
    useNullAsDefault: true
  }
}