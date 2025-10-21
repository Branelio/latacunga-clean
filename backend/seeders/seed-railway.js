const { Pool } = require('pg');

// Configuración para conectarse a Railway vía TCP Proxy
const pool = new Pool({
  host: 'switchback.proxy.rlwy.net',
  port: 57519,
  user: 'postgres',
  password: 'abc123',
  database: 'latacunga_clean',
  ssl: false
});

async function seedCollectionPoints() {
  const client = await pool.connect();
  
  try {
    console.log('🌱 Iniciando seed de puntos de recolección en Railway...');
    
    // Los 10 puntos de recolección de Latacunga
    const points = [
      {
        nombre: 'Punto de Recolección Centro',
        descripcion: 'Ubicado en el parque Vicente León, centro histórico',
        direccion: 'Parque Vicente León, Latacunga',
        lat: -0.9346,
        lon: -78.6156,
        tipo: 'contenedor',
        capacidad_kg: 500,
        horario: 'Lunes a Domingo 6:00-20:00'
      },
      {
        nombre: 'Punto de Recolección La Matriz',
        descripcion: 'Cerca de la Iglesia Matriz',
        direccion: 'Calle Quito y Belisario Quevedo',
        lat: -0.9356,
        lon: -78.6146,
        tipo: 'contenedor',
        capacidad_kg: 500,
        horario: 'Lunes a Domingo 6:00-20:00'
      },
      {
        nombre: 'Punto de Recolección La Laguna',
        descripcion: 'Sector La Laguna',
        direccion: 'Av. Eloy Alfaro y La Laguna',
        lat: -0.9256,
        lon: -78.6256,
        tipo: 'contenedor',
        capacidad_kg: 750,
        horario: 'Lunes a Domingo 6:00-20:00'
      },
      {
        nombre: 'Punto de Recolección San Felipe',
        descripcion: 'Parroquia San Felipe',
        direccion: 'Barrio San Felipe',
        lat: -0.9456,
        lon: -78.6056,
        tipo: 'contenedor',
        capacidad_kg: 500,
        horario: 'Lunes a Domingo 6:00-20:00'
      },
      {
        nombre: 'Punto de Recolección Salache',
        descripcion: 'Sector Salache Bajo',
        direccion: 'Vía a Salache',
        lat: -0.9856,
        lon: -78.6456,
        tipo: 'contenedor',
        capacidad_kg: 1000,
        horario: 'Lunes a Domingo 6:00-20:00'
      },
      {
        nombre: 'Punto de Recolección El Loreto',
        descripcion: 'Sector El Loreto',
        direccion: 'Barrio El Loreto',
        lat: -0.9146,
        lon: -78.6356,
        tipo: 'contenedor',
        capacidad_kg: 500,
        horario: 'Lunes a Domingo 6:00-20:00'
      },
      {
        nombre: 'Punto de Recolección Terminal Terrestre',
        descripcion: 'Junto al Terminal Terrestre',
        direccion: 'Terminal Terrestre de Latacunga',
        lat: -0.9246,
        lon: -78.6056,
        tipo: 'contenedor',
        capacidad_kg: 750,
        horario: 'Lunes a Domingo 6:00-22:00'
      },
      {
        nombre: 'Punto de Recolección La Estación',
        descripcion: 'Cerca de la antigua estación de tren',
        direccion: 'Sector La Estación',
        lat: -0.9446,
        lon: -78.6256,
        tipo: 'contenedor',
        capacidad_kg: 500,
        horario: 'Lunes a Domingo 6:00-20:00'
      },
      {
        nombre: 'Punto de Recolección San Buenaventura',
        descripcion: 'Sector San Buenaventura',
        direccion: 'Barrio San Buenaventura',
        lat: -0.9156,
        lon: -78.6456,
        tipo: 'contenedor',
        capacidad_kg: 500,
        horario: 'Lunes a Domingo 6:00-20:00'
      },
      {
        nombre: 'Punto de Recolección Ignacio Flores',
        descripcion: 'Sector Ignacio Flores',
        direccion: 'Barrio Ignacio Flores',
        lat: -0.9556,
        lon: -78.6156,
        tipo: 'contenedor',
        capacidad_kg: 500,
        horario: 'Lunes a Domingo 6:00-20:00'
      }
    ];

    // Insertar los puntos
    let insertados = 0;
    for (const point of points) {
      const query = `
        INSERT INTO collection_points 
        (name, description, address, location, type, capacity, waste_types, operating_hours, is_active)
        VALUES ($1, $2, $3, ST_SetSRID(ST_MakePoint($4, $5), 4326)::geography, $6, $7, $8, $9, true)
        ON CONFLICT DO NOTHING
        RETURNING id;
      `;
      
      const result = await client.query(query, [
        point.nombre,
        point.descripcion,
        point.direccion,
        point.lon, // PostGIS usa lon, lat
        point.lat,
        point.tipo,
        point.capacidad_kg,
        ['plástico', 'papel', 'vidrio', 'orgánico'], // waste_types
        JSON.stringify({ horario: point.horario }) // operating_hours como JSON
      ]);
      
      if (result.rows.length > 0) {
        insertados++;
        console.log(`✅ ${point.nombre} - insertado`);
      } else {
        console.log(`⚠️  ${point.nombre} - ya existe`);
      }
    }

    console.log(`\n🎉 Seed completado: ${insertados} puntos insertados`);
    
    // Verificar cuántos puntos hay en total
    const countResult = await client.query('SELECT COUNT(*) FROM collection_points');
    console.log(`📊 Total de puntos en la base de datos: ${countResult.rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Error al hacer seed:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

seedCollectionPoints();
