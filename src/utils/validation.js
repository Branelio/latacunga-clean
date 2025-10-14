/**
 * Utilidades de validación para formularios
 */

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email || email.trim() === '') {
    return { isValid: false, error: 'El correo electrónico es requerido' };
  }
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'El correo electrónico no es válido' };
  }
  
  return { isValid: true, error: null };
};

export const validatePassword = (password) => {
  if (!password || password.trim() === '') {
    return { isValid: false, error: 'La contraseña es requerida' };
  }
  
  if (password.length < 6) {
    return { isValid: false, error: 'La contraseña debe tener al menos 6 caracteres' };
  }
  
  return { isValid: true, error: null };
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  
  if (!phone || phone.trim() === '') {
    return { isValid: false, error: 'El teléfono es requerido' };
  }
  
  if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    return { isValid: false, error: 'El teléfono debe tener 10 dígitos' };
  }
  
  return { isValid: true, error: null };
};

export const validateName = (name) => {
  if (!name || name.trim() === '') {
    return { isValid: false, error: 'El nombre es requerido' };
  }
  
  if (name.trim().length < 2) {
    return { isValid: false, error: 'El nombre debe tener al menos 2 caracteres' };
  }
  
  if (name.trim().length > 50) {
    return { isValid: false, error: 'El nombre no puede tener más de 50 caracteres' };
  }
  
  return { isValid: true, error: null };
};

export const validateRequired = (value, fieldName = 'Este campo') => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return { isValid: false, error: `${fieldName} es requerido` };
  }
  
  return { isValid: true, error: null };
};

export const validateLength = (value, min, max, fieldName = 'Este campo') => {
  if (!value) {
    return { isValid: false, error: `${fieldName} es requerido` };
  }
  
  const length = value.length;
  
  if (length < min) {
    return { 
      isValid: false, 
      error: `${fieldName} debe tener al menos ${min} caracteres` 
    };
  }
  
  if (max && length > max) {
    return { 
      isValid: false, 
      error: `${fieldName} no puede tener más de ${max} caracteres` 
    };
  }
  
  return { isValid: true, error: null };
};

export const validateURL = (url) => {
  const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  
  if (!url || url.trim() === '') {
    return { isValid: false, error: 'La URL es requerida' };
  }
  
  if (!urlRegex.test(url)) {
    return { isValid: false, error: 'La URL no es válida' };
  }
  
  return { isValid: true, error: null };
};

/**
 * Validar formulario completo
 * @param {Object} fields - Objeto con los campos a validar
 * @param {Object} rules - Reglas de validación
 * @returns {Object} - { isValid: boolean, errors: {} }
 */
export const validateForm = (fields, rules) => {
  const errors = {};
  let isValid = true;
  
  Object.keys(rules).forEach((fieldName) => {
    const fieldValue = fields[fieldName];
    const fieldRules = rules[fieldName];
    
    fieldRules.forEach((rule) => {
      const result = rule(fieldValue);
      if (!result.isValid) {
        errors[fieldName] = result.error;
        isValid = false;
      }
    });
  });
  
  return { isValid, errors };
};

/**
 * Ejemplo de uso:
 * 
 * const fields = {
 *   email: 'user@example.com',
 *   password: '123456',
 *   name: 'John Doe'
 * };
 * 
 * const rules = {
 *   email: [validateEmail],
 *   password: [validatePassword],
 *   name: [validateName]
 * };
 * 
 * const { isValid, errors } = validateForm(fields, rules);
 */
