const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Importar conexiones a bases de datos
const connectMongoDB = require('./config/mongodb');
const { connectPostgres } = require('./config/postgres');
const { connectRedis } = require('./config/redis');

// Importar rutas
const authRoutes = require('./routes/auth.routes');
const collectionPointRoutes = require('./routes/collectionPoint.routes');
const reportRoutes = require('./routes/report.routes');
const userRoutes = require('./routes/user.routes');
const statsRoutes = require('./routes/stats.routes');

const app = express();

// Conectar a las bases de datos
connectMongoDB();
connectPostgres();
connectRedis();

// Middlewares de seguridad
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://tu-dominio.com'] 
    : '*',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 peticiones por ventana
  message: 'Demasiadas peticiones desde esta IP, por favor intenta más tarde.'
});
app.use('/api/', limiter);

// Middlewares generales
app.use(morgan('dev'));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos
app.use('/uploads', express.static('uploads'));

// Rutas
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenido a Latacunga Clean API',
    version: '1.0.0',
    status: 'active',
  });
});

// Health check endpoint para Railway
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/collection-points', collectionPointRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stats', statsRoutes);

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'; // Escuchar en todas las interfaces

app.listen(PORT, HOST, () => {
  console.log(`
  ╔═══════════════════════════════════════════╗
  ║   🌱 Latacunga Clean API Server 🌱       ║
  ╠═══════════════════════════════════════════╣
  ║   Servidor iniciado en puerto: ${PORT}      ║
  ║   Ambiente: ${process.env.NODE_ENV}              ║
  ║   URL Local: http://localhost:${PORT}            ║
  ║   URL Red: http://192.168.0.147:${PORT}          ║
  ╚═══════════════════════════════════════════╝
  `);
});

module.exports = app;
