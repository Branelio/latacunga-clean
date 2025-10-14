const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    required: [true, 'El tipo de reporte es requerido'],
    enum: ['acumulacion', 'contenedor_lleno', 'contenedor_danado', 'vertedero_ilegal', 'otro'],
  },
  title: {
    type: String,
    required: [true, 'El título es requerido'],
    trim: true,
    maxlength: [200, 'El título no puede exceder 200 caracteres'],
  },
  description: {
    type: String,
    required: [true, 'La descripción es requerida'],
    trim: true,
    maxlength: [1000, 'La descripción no puede exceder 1000 caracteres'],
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
    address: {
      type: String,
      trim: true,
    },
  },
  images: [{
    type: String, // URLs de las imágenes
  }],
  severity: {
    type: String,
    enum: ['baja', 'media', 'alta', 'critica'],
    default: 'media',
  },
  status: {
    type: String,
    enum: ['pendiente', 'en_revision', 'en_proceso', 'resuelto', 'rechazado'],
    default: 'pendiente',
  },
  priority: {
    type: Number,
    min: 1,
    max: 5,
    default: 3,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  collectionPoint: {
    type: Number, // ID de PostgreSQL
    default: null,
  },
  verification: {
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    verifiedAt: {
      type: Date,
    },
    verificationNotes: {
      type: String,
    },
  },
  resolution: {
    resolvedAt: {
      type: Date,
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    resolutionNotes: {
      type: String,
    },
    resolutionImages: [{
      type: String,
    }],
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    text: {
      type: String,
      required: true,
      maxlength: 500,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  visibility: {
    type: String,
    enum: ['public', 'private', 'restricted'],
    default: 'public',
  },
}, {
  timestamps: true,
});

// Índices
reportSchema.index({ location: '2dsphere' });
reportSchema.index({ user: 1, createdAt: -1 });
reportSchema.index({ status: 1 });
reportSchema.index({ type: 1 });
reportSchema.index({ createdAt: -1 });

// Virtual para contar likes
reportSchema.virtual('likesCount').get(function() {
  return this.likes.length;
});

// Virtual para contar comentarios
reportSchema.virtual('commentsCount').get(function() {
  return this.comments.length;
});

// Middleware pre-save para calcular prioridad automáticamente
reportSchema.pre('save', function(next) {
  if (this.isModified('severity') || this.isModified('type')) {
    const severityPoints = {
      'baja': 1,
      'media': 2,
      'alta': 3,
      'critica': 4,
    };
    
    const typePoints = {
      'acumulacion': 2,
      'contenedor_lleno': 1,
      'contenedor_danado': 2,
      'vertedero_ilegal': 3,
      'otro': 1,
    };

    const severityValue = severityPoints[this.severity] || 2;
    const typeValue = typePoints[this.type] || 1;
    
    this.priority = Math.min(5, Math.ceil((severityValue + typeValue) / 2));
  }
  next();
});

// Configurar para incluir virtuals en JSON
reportSchema.set('toJSON', { virtuals: true });
reportSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Report', reportSchema);
