const { Pool } = require('pg');

let pool = null;

function initDb() {
  if (pool) {
    return pool;
  }

  pool = new Pool({
    host: process.env.DB_HOST || 'postgres',
    port: parseInt(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'monitoring',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  pool.on('connect', () => {
    console.log('✅ Connected to PostgreSQL');
  });

  pool.on('error', (err) => {
    console.error('PostgreSQL pool error:', err);
  });

  // Inicjalizuj tabelę
  initTables().catch(console.error);

  return pool;
}

async function initTables() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS logs (
      id SERIAL PRIMARY KEY,
      level VARCHAR(20) NOT NULL,
      message TEXT NOT NULL,
      metadata JSONB DEFAULT '{}',
      created_at TIMESTAMP DEFAULT NOW()
    );
    
    CREATE INDEX IF NOT EXISTS idx_logs_created_at ON logs(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_logs_level ON logs(level);
  `;

  try {
    await pool.query(createTableQuery);
    console.log('✅ Database tables initialized');
  } catch (error) {
    console.error('Error initializing tables:', error);
  }
}

function getDbPool() {
  if (!pool) {
    throw new Error('Database pool not initialized. Call initDb() first.');
  }
  return pool;
}

// Initialize on module load
initDb();

module.exports = { initDb, getDbPool };