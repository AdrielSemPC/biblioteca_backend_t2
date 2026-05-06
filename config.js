const { Pool } = require('pg')

const isProduction = process.env.NODE_ENV === 'production'

let pool = null;
if (isProduction) {
    pool = new Pool({
        connectionString: process.env.URL_BANCO_DE_DADOS, ssl: {
        rejectUnauthorized: false,
        }
    })
    } else {
    pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'biblioteca_pwa',
        password: 'postgres',
        port: 5432
    })
}

module.exports = { pool }