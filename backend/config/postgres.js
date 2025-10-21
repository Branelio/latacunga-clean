const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const connectPostgres = async () => {
  try {
    const client = await pool.connect();
    
    // Crear extensión PostGIS si no existe (PRIMERO)
    await client.query('CREATE EXTENSION IF NOT EXISTS postgis');
    
    // Verificar que PostGIS está instalado (DESPUÉS)
    const result = await client.query('SELECT PostGIS_Version()');
    console.log(`✅ PostgreSQL/PostGIS conectado: ${result.rows[0].postgis_version}`);
    
    // Eliminar tabla antigua si existe (para recrear con estructura correcta)
    await client.query(`DROP TABLE IF EXISTS collection_points CASCADE`);
    
    // Crear tabla de puntos de acopio con estructura correcta
    await client.query(`
      CREATE TABLE collection_points (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        address VARCHAR(500),
        type VARCHAR(50),
        capacity INTEGER,
        current_fill INTEGER DEFAULT 0,
        waste_types TEXT[],
        location GEOGRAPHY(POINT, 4326) NOT NULL,
        operating_hours JSONB,
        contact_phone VARCHAR(20),
        contact_email VARCHAR(100),
        is_active BOOLEAN DEFAULT true,
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Crear índice espacial
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_collection_points_location 
      ON collection_points USING GIST(location)
    `);

    console.log('✅ Tablas de PostgreSQL inicializadas');
    
    client.release();
  } catch (error) {
    console.error('❌ Error al conectar PostgreSQL:', error.message);
    process.exit(1);
  }
};

// Función helper para consultas
const query = (text, params) => pool.query(text, params);

// Función para obtener cliente (útil para transacciones)
const getClient = () => pool.connect();

module.exports = {
  connectPostgres,
  query,
  getClient,
  pool,
};
