const { Pool } = require('pg');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

const shouldUseSsl =
  isProduction && (process.env.DB_SSL !== 'false' && process.env.DB_SSL !== '0');
const rejectUnauthorized =
  process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false' &&
  process.env.DB_SSL_REJECT_UNAUTHORIZED !== '0';
const sslCa = process.env.DB_SSL_CA;

const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ...(shouldUseSsl
        ? {
            ssl: {
              rejectUnauthorized,
              ...(sslCa ? { ca: sslCa } : {}),
            },
          }
        : {}),
    }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'environmental_db',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD,
    };

const pool = new Pool({
  ...poolConfig,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test de connexion
pool.on('connect', () => {
  console.log('✅ Connexion PostgreSQL établie');
});

pool.on('error', (err) => {
  console.error('❌ Erreur PostgreSQL:', err);
  // In production, avoid killing the process on transient DB issues.
  if (!isProduction) process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
