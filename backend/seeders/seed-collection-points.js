require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});

// Puntos de acopio reales de Latacunga, Ecuador
// Coordenadas: Latacunga está aproximadamente en -0.9347°, -78.6156°
const collectionPoints = [
  {
    name: 'Centro de Acopio Municipal - Parque Vicente León',
    description: 'Punto de acopio principal ubicado en el Parque Vicente León. Recibe todo tipo de materiales reciclables.',
    address: 'Parque Vicente León, Calle Quito y Maldonado',
    type: 'Centro de Acopio',
    capacity: 5000,
    current_fill: 1200,
    waste_types: ['Plástico', 'Papel', 'Cartón', 'Vidrio', 'Metal'],
    latitude: -0.9329,
    longitude: -78.6150,
    operating_hours: {
      monday: '08:00-17:00',
      tuesday: '08:00-17:00',
      wednesday: '08:00-17:00',
      thursday: '08:00-17:00',
      friday: '08:00-17:00',
      saturday: '08:00-12:00',
      sunday: 'Cerrado'
    },
    contact_phone: '032800000',
    contact_email: 'reciclaje@latacunga.gob.ec',
    image_url: 'https://via.placeholder.com/300x200?text=Centro+Acopio+Municipal'
  },
  {
    name: 'Contenedor de Reciclaje - Av. Eloy Alfaro',
    description: 'Contenedor de reciclaje en la avenida principal. Disponible 24/7.',
    address: 'Av. Eloy Alfaro, frente al Coliseo Mayor',
    type: 'Contenedor',
    capacity: 1000,
    current_fill: 450,
    waste_types: ['Plástico', 'Papel', 'Cartón'],
    latitude: -0.9285,
    longitude: -78.6125,
    operating_hours: {
      monday: '00:00-23:59',
      tuesday: '00:00-23:59',
      wednesday: '00:00-23:59',
      thursday: '00:00-23:59',
      friday: '00:00-23:59',
      saturday: '00:00-23:59',
      sunday: '00:00-23:59'
    },
    contact_phone: '032800000',
    contact_email: 'reciclaje@latacunga.gob.ec',
    image_url: 'https://via.placeholder.com/300x200?text=Contenedor+Eloy+Alfaro'
  },
  {
    name: 'Centro de Reciclaje EPAGAL',
    description: 'Centro especializado en reciclaje de electrónicos y residuos peligrosos.',
    address: 'Sector San Felipe, junto a las oficinas de EPAGAL',
    type: 'Centro de Reciclaje',
    capacity: 3000,
    current_fill: 800,
    waste_types: ['Electrónicos', 'Baterías', 'Aceites', 'Plástico'],
    latitude: -0.9410,
    longitude: -78.6180,
    operating_hours: {
      monday: '08:00-16:00',
      tuesday: '08:00-16:00',
      wednesday: '08:00-16:00',
      thursday: '08:00-16:00',
      friday: '08:00-16:00',
      saturday: 'Cerrado',
      sunday: 'Cerrado'
    },
    contact_phone: '032810500',
    contact_email: 'epagal@epagal.gob.ec',
    image_url: 'https://via.placeholder.com/300x200?text=Centro+EPAGAL'
  },
  {
    name: 'Punto Verde - La Matriz',
    description: 'Punto de acopio comunitario en el sector La Matriz.',
    address: 'Calle Salcedo y Marqués de Maenza',
    type: 'Centro de Acopio',
    capacity: 2000,
    current_fill: 600,
    waste_types: ['Plástico', 'Papel', 'Cartón', 'Vidrio'],
    latitude: -0.9350,
    longitude: -78.6170,
    operating_hours: {
      monday: '07:00-19:00',
      tuesday: '07:00-19:00',
      wednesday: '07:00-19:00',
      thursday: '07:00-19:00',
      friday: '07:00-19:00',
      saturday: '07:00-14:00',
      sunday: 'Cerrado'
    },
    contact_phone: '032800100',
    contact_email: 'puntoverde@latacunga.gob.ec',
    image_url: 'https://via.placeholder.com/300x200?text=Punto+Verde+Matriz'
  },
  {
    name: 'Contenedor - Mercado La Merced',
    description: 'Contenedor de reciclaje cerca del Mercado La Merced.',
    address: 'Av. 5 de Junio, junto al Mercado La Merced',
    type: 'Contenedor',
    capacity: 800,
    current_fill: 320,
    waste_types: ['Orgánico', 'Plástico', 'Cartón'],
    latitude: -0.9380,
    longitude: -78.6140,
    operating_hours: {
      monday: '00:00-23:59',
      tuesday: '00:00-23:59',
      wednesday: '00:00-23:59',
      thursday: '00:00-23:59',
      friday: '00:00-23:59',
      saturday: '00:00-23:59',
      sunday: '00:00-23:59'
    },
    contact_phone: '032800000',
    contact_email: 'reciclaje@latacunga.gob.ec',
    image_url: 'https://via.placeholder.com/300x200?text=Contenedor+Merced'
  },
  {
    name: 'Centro de Acopio - San Felipe',
    description: 'Centro comunitario de reciclaje en el sector San Felipe.',
    address: 'Barrio San Felipe, Calle Principal',
    type: 'Centro de Acopio',
    capacity: 2500,
    current_fill: 750,
    waste_types: ['Plástico', 'Papel', 'Cartón', 'Vidrio', 'Metal'],
    latitude: -0.9420,
    longitude: -78.6200,
    operating_hours: {
      monday: '08:00-17:00',
      tuesday: '08:00-17:00',
      wednesday: '08:00-17:00',
      thursday: '08:00-17:00',
      friday: '08:00-17:00',
      saturday: '08:00-13:00',
      sunday: 'Cerrado'
    },
    contact_phone: '032800200',
    contact_email: 'sanfelipe@latacunga.gob.ec',
    image_url: 'https://via.placeholder.com/300x200?text=Centro+San+Felipe'
  },
  {
    name: 'Contenedor - Av. Oriente',
    description: 'Contenedor de reciclaje en la Av. Oriente.',
    address: 'Av. Oriente, frente al Hospital Provincial',
    type: 'Contenedor',
    capacity: 1000,
    current_fill: 380,
    waste_types: ['Plástico', 'Papel', 'Cartón'],
    latitude: -0.9300,
    longitude: -78.6100,
    operating_hours: {
      monday: '00:00-23:59',
      tuesday: '00:00-23:59',
      wednesday: '00:00-23:59',
      thursday: '00:00-23:59',
      friday: '00:00-23:59',
      saturday: '00:00-23:59',
      sunday: '00:00-23:59'
    },
    contact_phone: '032800000',
    contact_email: 'reciclaje@latacunga.gob.ec',
    image_url: 'https://via.placeholder.com/300x200?text=Contenedor+Oriente'
  },
  {
    name: 'Centro de Reciclaje Universidad Técnica',
    description: 'Punto de reciclaje educativo en la Universidad Técnica de Cotopaxi.',
    address: 'Av. Simón Rodríguez, Universidad Técnica de Cotopaxi',
    type: 'Centro de Reciclaje',
    capacity: 1500,
    current_fill: 400,
    waste_types: ['Papel', 'Cartón', 'Plástico', 'Electrónicos'],
    latitude: -0.9250,
    longitude: -78.6050,
    operating_hours: {
      monday: '07:00-20:00',
      tuesday: '07:00-20:00',
      wednesday: '07:00-20:00',
      thursday: '07:00-20:00',
      friday: '07:00-20:00',
      saturday: 'Cerrado',
      sunday: 'Cerrado'
    },
    contact_phone: '032810296',
    contact_email: 'reciclaje@utc.edu.ec',
    image_url: 'https://via.placeholder.com/300x200?text=Centro+UTC'
  },
  {
    name: 'Punto de Acopio - Barrio La Laguna',
    description: 'Punto comunitario de reciclaje en el barrio La Laguna.',
    address: 'Barrio La Laguna, junto al parque infantil',
    type: 'Centro de Acopio',
    capacity: 1200,
    current_fill: 350,
    waste_types: ['Plástico', 'Vidrio', 'Metal'],
    latitude: -0.9450,
    longitude: -78.6220,
    operating_hours: {
      monday: '08:00-18:00',
      tuesday: '08:00-18:00',
      wednesday: '08:00-18:00',
      thursday: '08:00-18:00',
      friday: '08:00-18:00',
      saturday: '08:00-12:00',
      sunday: 'Cerrado'
    },
    contact_phone: '032800300',
    contact_email: 'lalaguna@latacunga.gob.ec',
    image_url: 'https://via.placeholder.com/300x200?text=Punto+Laguna'
  },
  {
    name: 'Contenedor - Redondel del Chasqui',
    description: 'Contenedor de reciclaje en el Redondel del Chasqui.',
    address: 'Av. Cotopaxi, Redondel del Chasqui',
    type: 'Contenedor',
    capacity: 900,
    current_fill: 270,
    waste_types: ['Plástico', 'Papel', 'Cartón'],
    latitude: -0.9200,
    longitude: -78.6080,
    operating_hours: {
      monday: '00:00-23:59',
      tuesday: '00:00-23:59',
      wednesday: '00:00-23:59',
      thursday: '00:00-23:59',
      friday: '00:00-23:59',
      saturday: '00:00-23:59',
      sunday: '00:00-23:59'
    },
    contact_phone: '032800000',
    contact_email: 'reciclaje@latacunga.gob.ec',
    image_url: 'https://via.placeholder.com/300x200?text=Contenedor+Chasqui'
  }
];

async function seedCollectionPoints() {
  const client = await pool.connect();
  
  try {
    console.log('🌱 Iniciando población de puntos de acopio...\n');

    // Eliminar puntos existentes
    await client.query('DELETE FROM collection_points');
    console.log('🗑️  Puntos anteriores eliminados\n');

    // Insertar nuevos puntos
    for (const point of collectionPoints) {
      await client.query(`
        INSERT INTO collection_points (
          name, description, address, type, capacity, current_fill,
          waste_types, location, operating_hours, contact_phone,
          contact_email, is_active, image_url
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7,
          ST_SetSRID(ST_MakePoint($8, $9), 4326)::geography,
          $10, $11, $12, true, $13
        )
      `, [
        point.name,
        point.description,
        point.address,
        point.type,
        point.capacity,
        point.current_fill,
        point.waste_types,
        point.longitude,
        point.latitude,
        JSON.stringify(point.operating_hours),
        point.contact_phone,
        point.contact_email,
        point.image_url
      ]);

      console.log(`✅ Punto creado: ${point.name}`);
    }

    console.log(`\n✅ ${collectionPoints.length} puntos de acopio creados exitosamente!\n`);

    // Mostrar resumen por tipo
    const summary = await client.query(`
      SELECT type, COUNT(*) as count
      FROM collection_points
      GROUP BY type
      ORDER BY count DESC
    `);

    console.log('📊 Resumen por tipo:');
    summary.rows.forEach(row => {
      console.log(`   - ${row.type}: ${row.count} puntos`);
    });

    console.log('\n✅ Base de datos lista para usar!\n');

  } catch (error) {
    console.error('❌ Error al poblar puntos de acopio:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

seedCollectionPoints();
