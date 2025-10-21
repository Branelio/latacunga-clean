const redis = require('redis');

let redisClient = null;

const connectRedis = async () => {
  try {
    // Si REDIS_URL existe (Railway/producción), usarlo directamente
    // Si no, usar variables individuales (desarrollo local)
    const redisConfig = process.env.REDIS_URL 
      ? { url: process.env.REDIS_URL }
      : {
          socket: {
            host: process.env.REDIS_HOST || 'localhost',
            port: process.env.REDIS_PORT || 6379,
          },
          password: process.env.REDIS_PASSWORD,
        };

    redisClient = redis.createClient(redisConfig);

    redisClient.on('error', (err) => {
      console.error('❌ Error de Redis:', err);
    });

    redisClient.on('connect', () => {
      console.log('✅ Redis conectado');
    });

    redisClient.on('ready', () => {
      console.log('✅ Redis listo para usar');
    });

    await redisClient.connect();

  } catch (error) {
    console.error('❌ Error al conectar Redis:', error.message);
    // Redis es opcional, no detener el servidor si falla
    console.warn('⚠️  La aplicación continuará sin caché Redis');
  }
};

// Funciones helper para caché
const getCache = async (key) => {
  if (!redisClient || !redisClient.isOpen) return null;
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error al obtener del caché:', error);
    return null;
  }
};

const setCache = async (key, value, expireInSeconds = 3600) => {
  if (!redisClient || !redisClient.isOpen) return false;
  try {
    await redisClient.setEx(key, expireInSeconds, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Error al guardar en caché:', error);
    return false;
  }
};

const deleteCache = async (key) => {
  if (!redisClient || !redisClient.isOpen) return false;
  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    console.error('Error al eliminar del caché:', error);
    return false;
  }
};

const clearCachePattern = async (pattern) => {
  if (!redisClient || !redisClient.isOpen) return false;
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
    return true;
  } catch (error) {
    console.error('Error al limpiar caché por patrón:', error);
    return false;
  }
};

module.exports = {
  connectRedis,
  redisClient: () => redisClient,
  getCache,
  setCache,
  deleteCache,
  clearCachePattern,
};
