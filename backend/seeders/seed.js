require('dotenv').config();
const mongoose = require('mongoose');
const { Pool } = require('pg');
const User = require('../models/User');
const Report = require('../models/Report');

// Conectar a MongoDB
const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    process.exit(1);
  }
};

// Conectar a PostgreSQL
const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});

// Datos de usuarios de ejemplo
const users = [
  {
    name: 'Admin Latacunga',
    email: 'admin@latacunga.ec',
    password: 'admin123',
    role: 'admin',
    phone: '032800000',
    points: 1500,
  },
  {
    name: 'Juan Pérez',
    email: 'juan.perez@example.com',
    password: 'usuario123',
    role: 'user',
    phone: '0998765432',
    points: 250,
  },
  {
    name: 'María González',
    email: 'maria.gonzalez@example.com',
    password: 'usuario123',
    role: 'user',
    phone: '0987654321',
    points: 450,
  },
  {
    name: 'Carlos Recolector',
    email: 'carlos.collector@latacunga.ec',
    password: 'collector123',
    role: 'collector',
    phone: '032801111',
    points: 800,
  },
];

// Puntos de acopio en Latacunga
const collectionPoints = [
  {
    name: 'Centro de Acopio Municipal',
    description: 'Principal centro de acopio de residuos del cantón Latacunga',
    address: 'Av. Eloy Alfaro y Calle Quito, Latacunga',
    type: 'centro_acopio',
    capacity: 5000,
    current_fill: 2300,
    waste_types: ['organico', 'plastico', 'papel', 'vidrio', 'metal'],
    latitude: -0.9322,
    longitude: -78.6155,
    operating_hours: JSON.stringify({
      'Lunes-Viernes': '08:00 - 17:00',
      'Sábado': '08:00 - 12:00',
      'Domingo': 'Cerrado',
    }),
    contact_phone: '032800500',
    contact_email: 'ambiente@latacunga.gob.ec',
  },
  {
    name: 'Punto de Reciclaje Parque Vicente León',
    description: 'Contenedores de reciclaje en el parque principal',
    address: 'Parque Vicente León, Centro Histórico',
    type: 'contenedor',
    capacity: 500,
    current_fill: 350,
    waste_types: ['plastico', 'papel', 'vidrio'],
    latitude: -0.9338,
    longitude: -78.6169,
    operating_hours: JSON.stringify({
      'Todos los días': '24 horas',
    }),
    contact_phone: '032800500',
  },
  {
    name: 'Centro de Acopio San Felipe',
    description: 'Centro comunitario de acopio de residuos',
    address: 'Barrio San Felipe, Calle Principal',
    type: 'centro_acopio',
    capacity: 2000,
    current_fill: 800,
    waste_types: ['organico', 'plastico', 'papel', 'metal'],
    latitude: -0.9278,
    longitude: -78.6201,
    operating_hours: JSON.stringify({
      'Lunes-Sábado': '09:00 - 16:00',
      'Domingo': 'Cerrado',
    }),
    contact_phone: '032800510',
  },
  {
    name: 'Punto Ecológico La Matriz',
    description: 'Contenedores de separación de residuos',
    address: 'Sector La Matriz, Av. 5 de Junio',
    type: 'contenedor',
    capacity: 300,
    current_fill: 180,
    waste_types: ['plastico', 'papel', 'vidrio'],
    latitude: -0.9301,
    longitude: -78.6143,
    operating_hours: JSON.stringify({
      'Todos los días': '24 horas',
    }),
  },
  {
    name: 'Centro de Reciclaje Electrónico EPAGAL',
    description: 'Punto especializado en residuos electrónicos y peligrosos',
    address: 'EPAGAL EP, Av. Amazonas',
    type: 'reciclaje',
    capacity: 1000,
    current_fill: 400,
    waste_types: ['electronico', 'peligroso'],
    latitude: -0.9356,
    longitude: -78.6128,
    operating_hours: JSON.stringify({
      'Lunes-Viernes': '08:30 - 16:30',
      'Sábado-Domingo': 'Cerrado',
    }),
    contact_phone: '032812300',
    contact_email: 'info@epagal.gob.ec',
  },
  {
    name: 'Punto Verde Eloy Alfaro',
    description: 'Contenedores de separación en vía principal',
    address: 'Av. Eloy Alfaro, frente al Hospital',
    type: 'contenedor',
    capacity: 400,
    current_fill: 250,
    waste_types: ['organico', 'plastico', 'papel'],
    latitude: -0.9289,
    longitude: -78.6187,
    operating_hours: JSON.stringify({
      'Todos los días': '24 horas',
    }),
  },
];

// Función para poblar usuarios
const seedUsers = async () => {
  try {
    await User.deleteMany({});
    console.log('🗑️  Usuarios anteriores eliminados');

    const createdUsers = [];
    for (const userData of users) {
      const user = await User.create(userData);
      user.updateLevel();
      await user.save();
      createdUsers.push(user);
      console.log(`✅ Usuario creado: ${user.name} (${user.email})`);
    }

    return createdUsers;
  } catch (error) {
    console.error('❌ Error creando usuarios:', error);
    throw error;
  }
};

// Función para poblar puntos de acopio
const seedCollectionPoints = async () => {
  try {
    await pool.query('DELETE FROM collection_points');
    console.log('🗑️  Puntos de acopio anteriores eliminados');

    for (const point of collectionPoints) {
      await pool.query(
        `INSERT INTO collection_points (
          name, description, address, type, capacity, current_capacity,
          waste_types, location, latitude, longitude, operating_hours, contact_phone, contact_email
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, ST_SetSRID(ST_MakePoint($9, $8), 4326)::geography, $8, $9, $10, $11, $12)`,
        [
          point.name,
          point.description,
          point.address,
          point.type,
          point.capacity,
          point.current_fill,
          point.waste_types,
          point.longitude,
          point.latitude,
          point.operating_hours,
          point.contact_phone,
          point.contact_email || null,
        ]
      );
      console.log(`✅ Punto de acopio creado: ${point.name}`);
    }
  } catch (error) {
    console.error('❌ Error creando puntos de acopio:', error);
    throw error;
  }
};

// Función para poblar reportes de ejemplo
const seedReports = async (users) => {
  try {
    await Report.deleteMany({});
    console.log('🗑️  Reportes anteriores eliminados');

    const reports = [
      {
        user: users[1]._id,
        type: 'acumulacion',
        title: 'Acumulación de basura en Parque Central',
        description:
          'Hay una gran acumulación de basura en la esquina del parque, necesita atención urgente.',
        location: {
          type: 'Point',
          coordinates: [-78.6165, -0.9335],
          address: 'Parque Central, Latacunga',
        },
        severity: 'alta',
        status: 'pendiente',
      },
      {
        user: users[2]._id,
        type: 'contenedor_lleno',
        title: 'Contenedor lleno en Av. Eloy Alfaro',
        description:
          'El contenedor de reciclaje está completamente lleno y la basura se está desbordando.',
        location: {
          type: 'Point',
          coordinates: [-78.6190, -0.9285],
          address: 'Av. Eloy Alfaro, Latacunga',
        },
        severity: 'media',
        status: 'en_revision',
      },
      {
        user: users[1]._id,
        type: 'contenedor_danado',
        title: 'Contenedor dañado necesita reparación',
        description: 'El contenedor está roto y no se puede utilizar correctamente.',
        location: {
          type: 'Point',
          coordinates: [-78.6145, -0.9305],
          address: 'Barrio La Matriz, Latacunga',
        },
        severity: 'baja',
        status: 'resuelto',
      },
      {
        user: users[2]._id,
        type: 'vertedero_ilegal',
        title: 'Vertedero ilegal en sector rural',
        description:
          'Se está utilizando un terreno baldío como vertedero ilegal de basura.',
        location: {
          type: 'Point',
          coordinates: [-78.6210, -0.9270],
          address: 'Sector San Felipe, Latacunga',
        },
        severity: 'critica',
        status: 'en_proceso',
      },
    ];

    for (const reportData of reports) {
      const report = await Report.create(reportData);
      console.log(`✅ Reporte creado: ${report.title}`);
    }
  } catch (error) {
    console.error('❌ Error creando reportes:', error);
    throw error;
  }
};

// Función principal
const seedDatabase = async () => {
  try {
    console.log('🌱 Iniciando población de base de datos...\n');

    // Conectar a MongoDB
    await connectMongoDB();

    // Poblar datos
    const createdUsers = await seedUsers();
    console.log('');

    await seedCollectionPoints();
    console.log('');

    await seedReports(createdUsers);
    console.log('');

    console.log('✅ ¡Base de datos poblada exitosamente!');
    console.log('\n📊 Resumen:');
    console.log(`   - ${users.length} usuarios creados`);
    console.log(`   - ${collectionPoints.length} puntos de acopio creados`);
    console.log(`   - 4 reportes de ejemplo creados`);
    console.log('\n🔐 Credenciales de acceso:');
    console.log('   Admin: admin@latacunga.ec / admin123');
    console.log('   Usuario 1: juan.perez@example.com / usuario123');
    console.log('   Usuario 2: maria.gonzalez@example.com / usuario123');
    console.log('   Recolector: carlos.collector@latacunga.ec / collector123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error en el proceso de población:', error);
    process.exit(1);
  }
};

// Ejecutar
seedDatabase();
