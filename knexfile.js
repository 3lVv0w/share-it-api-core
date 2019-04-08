module.exports = {
  development: {
    client: 'pg',
    connection:{
      host:'localhost',
      username:'MSI',
      password: 'password',
      database: 'share_it'
    },
    pool: { min: 0, max: 20 },
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/dev'
    },
    useNullAsDefault: true
  },

  production: {
    client: 'pg',
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