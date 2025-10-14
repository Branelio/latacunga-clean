const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres'],
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido'],
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    select: false, // No incluir en las consultas por defecto
  },
  phone: {
    type: String,
    trim: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'collector'],
    default: 'user',
  },
  points: {
    type: Number,
    default: 0,
    min: 0,
  },
  level: {
    type: String,
    default: 'Nuevo Ciudadano',
  },
  avatar: {
    type: String,
    default: null,
  },
  address: {
    street: String,
    neighborhood: String,
    city: {
      type: String,
      default: 'Latacunga',
    },
    province: {
      type: String,
      default: 'Cotopaxi',
    },
  },
  preferences: {
    notifications: {
      type: Boolean,
      default: true,
    },
    newsletter: {
      type: Boolean,
      default: false,
    },
  },
  stats: {
    totalReports: {
      type: Number,
      default: 0,
    },
    verifiedReports: {
      type: Number,
      default: 0,
    },
    properDisposals: {
      type: Number,
      default: 0,
    },
    recyclingActions: {
      type: Number,
      default: 0,
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

// Índices
userSchema.index({ email: 1 });
userSchema.index({ points: -1 });

// Hash de contraseña antes de guardar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para comparar contraseñas
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Método para actualizar nivel basado en puntos
userSchema.methods.updateLevel = function() {
  const levels = [
    { name: 'Nuevo Ciudadano', minPoints: 0, maxPoints: 49 },
    { name: 'Ciudadano Activo', minPoints: 50, maxPoints: 199 },
    { name: 'Eco-Guerrero', minPoints: 200, maxPoints: 499 },
    { name: 'Guardián Verde', minPoints: 500, maxPoints: 999 },
    { name: 'Héroe Ambiental', minPoints: 1000, maxPoints: Infinity },
  ];

  const currentLevel = levels.find(
    level => this.points >= level.minPoints && this.points <= level.maxPoints
  );

  if (currentLevel) {
    this.level = currentLevel.name;
  }
};

// Método para añadir puntos
userSchema.methods.addPoints = async function(points, reason) {
  this.points += points;
  this.updateLevel();
  await this.save();
  
  // Aquí podrías registrar el historial de puntos
  console.log(`Usuario ${this.name} ganó ${points} puntos por: ${reason}`);
  
  return this.points;
};

// Virtual para el avatar por defecto
userSchema.virtual('avatarUrl').get(function() {
  return this.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(this.name)}&background=2E7D32&color=fff`;
});

// Configurar para incluir virtuals en JSON
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('User', userSchema);
