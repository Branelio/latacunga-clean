const { validationResult } = require('express-validator');
const Report = require('../models/Report');
const User = require('../models/User');

// @desc    Obtener todos los reportes
// @route   GET /api/reports
// @access  Public
exports.getAllReports = async (req, res) => {
  try {
    const { status, type, severity, page = 1, limit = 20 } = req.query;

    const filter = { visibility: 'public' };
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (severity) filter.severity = severity;

    const reports = await Report.find(filter)
      .populate('user', 'name avatar points level')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Report.countDocuments(filter);

    res.json({
      success: true,
      count: reports.length,
      total: count,
      page: parseInt(page),
      pages: Math.ceil(count / limit),
      data: reports,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener reportes',
      error: error.message,
    });
  }
};

// @desc    Obtener reportes del usuario actual
// @route   GET /api/reports/user
// @access  Private
exports.getUserReports = async (req, res) => {
  try {
    const reports = await Report.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener reportes del usuario',
      error: error.message,
    });
  }
};

// @desc    Obtener reportes cercanos
// @route   GET /api/reports/nearby?lat=&lng=&radius=
// @access  Public
exports.getNearbyReports = async (req, res) => {
  try {
    const { lat, lng, radius = 5000 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitud y longitud son requeridas',
      });
    }

    const reports = await Report.find({
      visibility: 'public',
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: parseInt(radius),
        },
      },
    })
      .populate('user', 'name avatar points level')
      .limit(50);

    res.json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener reportes cercanos',
      error: error.message,
    });
  }
};

// @desc    Obtener reporte por ID
// @route   GET /api/reports/:id
// @access  Public
exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('user', 'name avatar points level')
      .populate('comments.user', 'name avatar')
      .populate('assignedTo', 'name email')
      .populate('verification.verifiedBy', 'name')
      .populate('resolution.resolvedBy', 'name');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Reporte no encontrado',
      });
    }

    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener reporte',
      error: error.message,
    });
  }
};

// @desc    Crear nuevo reporte
// @route   POST /api/reports
// @access  Private
exports.createReport = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  try {
    const {
      type,
      title,
      description,
      location,
      severity,
      visibility,
    } = req.body;

    // Procesar imágenes subidas
    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const report = await Report.create({
      user: req.user.id,
      type,
      title,
      description,
      location,
      images,
      severity: severity || 'media',
      visibility: visibility || 'public',
    });

    // Dar puntos al usuario
    await req.user.addPoints(10, 'Reporte creado');

    // Actualizar estadísticas del usuario
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { 'stats.totalReports': 1 },
    });

    const populatedReport = await Report.findById(report._id)
      .populate('user', 'name avatar points level');

    res.status(201).json({
      success: true,
      data: populatedReport,
      message: 'Reporte creado exitosamente. ¡Has ganado 10 puntos!',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al crear reporte',
      error: error.message,
    });
  }
};

// @desc    Actualizar reporte
// @route   PUT /api/reports/:id
// @access  Private
exports.updateReport = async (req, res) => {
  try {
    let report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Reporte no encontrado',
      });
    }

    // Verificar que el usuario sea el dueño o admin
    if (report.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para actualizar este reporte',
      });
    }

    report = await Report.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar reporte',
      error: error.message,
    });
  }
};

// @desc    Eliminar reporte
// @route   DELETE /api/reports/:id
// @access  Private
exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Reporte no encontrado',
      });
    }

    // Verificar que el usuario sea el dueño o admin
    if (report.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para eliminar este reporte',
      });
    }

    await report.deleteOne();

    res.json({
      success: true,
      message: 'Reporte eliminado',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar reporte',
      error: error.message,
    });
  }
};

// @desc    Dar like a un reporte
// @route   POST /api/reports/:id/like
// @access  Private
exports.likeReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Reporte no encontrado',
      });
    }

    // Verificar si ya dio like
    const hasLiked = report.likes.includes(req.user.id);

    if (hasLiked) {
      // Quitar like
      report.likes = report.likes.filter(
        like => like.toString() !== req.user.id
      );
    } else {
      // Agregar like
      report.likes.push(req.user.id);
    }

    await report.save();

    res.json({
      success: true,
      liked: !hasLiked,
      likesCount: report.likes.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar like',
      error: error.message,
    });
  }
};

// @desc    Comentar en un reporte
// @route   POST /api/reports/:id/comment
// @access  Private
exports.addComment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Reporte no encontrado',
      });
    }

    const comment = {
      user: req.user.id,
      text: req.body.text,
    };

    report.comments.push(comment);
    await report.save();

    const updatedReport = await Report.findById(req.params.id)
      .populate('comments.user', 'name avatar');

    res.json({
      success: true,
      data: updatedReport,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al agregar comentario',
      error: error.message,
    });
  }
};
