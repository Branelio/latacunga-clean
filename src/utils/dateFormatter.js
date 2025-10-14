/**
 * Utilidades para formateo de fechas y tiempos
 */

/**
 * Formatear fecha a formato legible en español
 * @param {Date|string} date - Fecha a formatear
 * @returns {string} - Fecha formateada
 */
export const formatDate = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  
  return `${day}/${month}/${year}`;
};

/**
 * Formatear fecha y hora
 * @param {Date|string} date - Fecha a formatear
 * @returns {string} - Fecha y hora formateada
 */
export const formatDateTime = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

/**
 * Formatear solo la hora
 * @param {Date|string} date - Fecha a formatear
 * @returns {string} - Hora formateada
 */
export const formatTime = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  
  return `${hours}:${minutes}`;
};

/**
 * Obtener fecha relativa (hace 2 horas, hace 3 días, etc.)
 * @param {Date|string} date - Fecha a formatear
 * @returns {string} - Fecha relativa
 */
export const getRelativeTime = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const d = new Date(date);
  const diffMs = now - d;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);
  
  if (diffSeconds < 60) {
    return 'Hace un momento';
  } else if (diffMinutes < 60) {
    return `Hace ${diffMinutes} ${diffMinutes === 1 ? 'minuto' : 'minutos'}`;
  } else if (diffHours < 24) {
    return `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
  } else if (diffDays < 30) {
    return `Hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
  } else if (diffMonths < 12) {
    return `Hace ${diffMonths} ${diffMonths === 1 ? 'mes' : 'meses'}`;
  } else {
    return `Hace ${diffYears} ${diffYears === 1 ? 'año' : 'años'}`;
  }
};

/**
 * Obtener nombre del día de la semana
 * @param {Date|string} date - Fecha
 * @returns {string} - Nombre del día
 */
export const getDayName = (date) => {
  if (!date) return '';
  
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const d = new Date(date);
  
  return days[d.getDay()];
};

/**
 * Obtener nombre del mes
 * @param {Date|string} date - Fecha
 * @returns {string} - Nombre del mes
 */
export const getMonthName = (date) => {
  if (!date) return '';
  
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  const d = new Date(date);
  
  return months[d.getMonth()];
};

/**
 * Formatear fecha en formato largo (Lunes, 15 de Octubre de 2025)
 * @param {Date|string} date - Fecha
 * @returns {string} - Fecha en formato largo
 */
export const formatDateLong = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  const dayName = getDayName(d);
  const day = d.getDate();
  const monthName = getMonthName(d);
  const year = d.getFullYear();
  
  return `${dayName}, ${day} de ${monthName} de ${year}`;
};

/**
 * Verificar si una fecha es hoy
 * @param {Date|string} date - Fecha a verificar
 * @returns {boolean}
 */
export const isToday = (date) => {
  if (!date) return false;
  
  const today = new Date();
  const d = new Date(date);
  
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
};

/**
 * Verificar si una fecha es ayer
 * @param {Date|string} date - Fecha a verificar
 * @returns {boolean}
 */
export const isYesterday = (date) => {
  if (!date) return false;
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const d = new Date(date);
  
  return (
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear()
  );
};

/**
 * Formatear duración en minutos
 * @param {number} minutes - Duración en minutos
 * @returns {string} - Duración formateada
 */
export const formatDuration = (minutes) => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (mins === 0) {
    return `${hours} h`;
  }
  
  return `${hours} h ${mins} min`;
};

/**
 * Calcular edad a partir de fecha de nacimiento
 * @param {Date|string} birthDate - Fecha de nacimiento
 * @returns {number} - Edad en años
 */
export const calculateAge = (birthDate) => {
  if (!birthDate) return 0;
  
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};
