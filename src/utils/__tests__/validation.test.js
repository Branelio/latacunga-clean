import { validateEmail, validatePassword, validateName, validateForm } from '../validation';

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    it('validates correct email', () => {
      const result = validateEmail('test@example.com');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('rejects invalid email format', () => {
      const result = validateEmail('invalid-email');
      expect(result.isValid).toBe(false);
      expect(result.error).toBeTruthy();
    });

    it('rejects empty email', () => {
      const result = validateEmail('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('El correo electrónico es requerido');
    });
  });

  describe('validatePassword', () => {
    it('validates correct password', () => {
      const result = validatePassword('password123');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('rejects short password', () => {
      const result = validatePassword('12345');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('La contraseña debe tener al menos 6 caracteres');
    });

    it('rejects empty password', () => {
      const result = validatePassword('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('La contraseña es requerida');
    });
  });

  describe('validateName', () => {
    it('validates correct name', () => {
      const result = validateName('John Doe');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('rejects short name', () => {
      const result = validateName('J');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('El nombre debe tener al menos 2 caracteres');
    });

    it('rejects empty name', () => {
      const result = validateName('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('El nombre es requerido');
    });
  });

  describe('validateForm', () => {
    it('validates complete form correctly', () => {
      const fields = {
        email: 'test@example.com',
        password: 'password123',
        name: 'John Doe',
      };

      const rules = {
        email: [validateEmail],
        password: [validatePassword],
        name: [validateName],
      };

      const { isValid, errors } = validateForm(fields, rules);
      expect(isValid).toBe(true);
      expect(Object.keys(errors).length).toBe(0);
    });

    it('returns errors for invalid fields', () => {
      const fields = {
        email: 'invalid-email',
        password: '123',
        name: '',
      };

      const rules = {
        email: [validateEmail],
        password: [validatePassword],
        name: [validateName],
      };

      const { isValid, errors } = validateForm(fields, rules);
      expect(isValid).toBe(false);
      expect(errors.email).toBeTruthy();
      expect(errors.password).toBeTruthy();
      expect(errors.name).toBeTruthy();
    });
  });
});
