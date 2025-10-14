// Configuración y constantes de la aplicación

// URL del API - Cambiar según entorno
export const API_URL = __DEV__ 
  ? 'http://192.168.0.147:3000/api' // Tu IP local
  : 'https://api.latacunga-clean.com/api';

// Log de configuración
console.log('⚙️ Configuración de API:', {
  isDev: __DEV__,
  apiUrl: API_URL,
});

// Colores de la aplicación
export const COLORS = {
  primary: '#2E7D32',      // Verde principal
  secondary: '#4CAF50',    // Verde secundario
  accent: '#FF9800',       // Naranja accent
  background: '#F5F5F5',   // Gris claro fondo
  white: '#FFFFFF',
  text: '#212121',         // Texto principal
  textSecondary: '#757575', // Texto secundario
  success: '#4CAF50',      // Verde éxito
  error: '#F44336',        // Rojo error
  warning: '#FFC107',      // Amarillo advertencia
  info: '#2196F3',         // Azul información
};

// Tipos de residuos
export const WASTE_TYPES = [
  {
    id: 'organico',
    label: 'Orgánico',
    icon: 'food-apple',
    color: '#8BC34A',
    description: 'Restos de comida, cáscaras, residuos de jardín',
  },
  {
    id: 'plastico',
    label: 'Plástico',
    icon: 'bottle-soda',
    color: '#2196F3',
    description: 'Botellas, envases, bolsas de plástico',
  },
  {
    id: 'papel',
    label: 'Papel',
    icon: 'file-document',
    color: '#FF9800',
    description: 'Periódicos, cajas de cartón, documentos',
  },
  {
    id: 'vidrio',
    label: 'Vidrio',
    icon: 'glass-fragile',
    color: '#4CAF50',
    description: 'Botellas de vidrio, frascos, cristalería',
  },
  {
    id: 'metal',
    label: 'Metal',
    icon: 'silverware-fork-knife',
    color: '#9E9E9E',
    description: 'Latas, cables, utensilios metálicos',
  },
  {
    id: 'electronico',
    label: 'Electrónico',
    icon: 'cellphone',
    color: '#673AB7',
    description: 'Celulares, computadoras, electrodomésticos',
  },
  {
    id: 'peligroso',
    label: 'Peligroso',
    icon: 'biohazard',
    color: '#F44336',
    description: 'Pilas, baterías, químicos, medicamentos vencidos',
  },
];

// Tipos de reportes
export const REPORT_TYPES = [
  {
    id: 'basural_ilegal',
    label: 'Basural Ilegal',
    icon: 'delete-alert',
    color: '#F44336',
  },
  {
    id: 'contenedor_lleno',
    label: 'Contenedor Lleno',
    icon: 'delete-circle',
    color: '#FF9800',
  },
  {
    id: 'residuo_peligroso',
    label: 'Residuo Peligroso',
    icon: 'biohazard',
    color: '#9C27B0',
  },
  {
    id: 'punto_reciclaje',
    label: 'Nuevo Punto',
    icon: 'recycle',
    color: '#4CAF50',
  },
  {
    id: 'otro',
    label: 'Otro',
    icon: 'dots-horizontal',
    color: '#757575',
  },
];

// Configuración de puntos
export const POINTS_CONFIG = {
  CREATE_REPORT: 10,
  REPORT_VERIFIED: 20,
  COMMENT_ON_REPORT: 2,
  LIKE_REPORT: 1,
  VERIFY_COLLECTION_POINT: 5,
  SHARE_APP: 15,
  COMPLETE_PROFILE: 5,
};

// Niveles de usuario
export const USER_LEVELS = [
  {
    id: 1,
    name: 'Principiante',
    badge: '🌱',
    minPoints: 0,
    maxPoints: 49,
    color: '#8BC34A',
  },
  {
    id: 2,
    name: 'Eco-Consciente',
    badge: '🌿',
    minPoints: 50,
    maxPoints: 99,
    color: '#4CAF50',
  },
  {
    id: 3,
    name: 'Guardián Verde',
    badge: '🌳',
    minPoints: 100,
    maxPoints: 199,
    color: '#2E7D32',
  },
  {
    id: 4,
    name: 'Héroe Ambiental',
    badge: '🏆',
    minPoints: 200,
    maxPoints: 499,
    color: '#FFC107',
  },
  {
    id: 5,
    name: 'Embajador Ecológico',
    badge: '⭐',
    minPoints: 500,
    maxPoints: Infinity,
    color: '#FF9800',
  },
];

// Función helper para obtener el nivel del usuario
export const getUserLevel = (points) => {
  return USER_LEVELS.find(
    (level) => points >= level.minPoints && points <= level.maxPoints
  ) || USER_LEVELS[0];
};

// Región inicial del mapa (Latacunga, Ecuador)
export const INITIAL_REGION = {
  latitude: -0.9322,
  longitude: -78.6155,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

// Configuración de caché
export const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Verifica tu internet.',
  UNAUTHORIZED: 'Sesión expirada. Por favor inicia sesión nuevamente.',
  NOT_FOUND: 'Recurso no encontrado.',
  SERVER_ERROR: 'Error del servidor. Intenta más tarde.',
  VALIDATION_ERROR: 'Por favor verifica los datos ingresados.',
  LOCATION_PERMISSION_DENIED: 'Se necesita permiso de ubicación para esta función.',
  LOCATION_UNAVAILABLE: 'No se pudo obtener tu ubicación.',
};

// Configuración de validación
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_TITLE_LENGTH: 200,
  MAX_DESCRIPTION_LENGTH: 1000,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
};

// Estados de reportes
export const REPORT_STATUSES = [
  { id: 'pendiente', label: 'Pendiente', color: COLORS.warning },
  { id: 'en_revision', label: 'En Revisión', color: COLORS.info },
  { id: 'en_proceso', label: 'En Proceso', color: COLORS.secondary },
  { id: 'resuelto', label: 'Resuelto', color: COLORS.success },
  { id: 'rechazado', label: 'Rechazado', color: COLORS.error },
];

// Niveles de severidad
export const SEVERITY_LEVELS = [
  { id: 'baja', label: 'Baja', color: COLORS.info },
  { id: 'media', label: 'Media', color: COLORS.warning },
  { id: 'alta', label: 'Alta', color: COLORS.accent },
  { id: 'critica', label: 'Crítica', color: COLORS.error },
];
