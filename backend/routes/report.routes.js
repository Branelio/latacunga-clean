const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const reportController = require('../controllers/report.controller');
const { protect } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// @route   GET /api/reports
// @desc    Obtener todos los reportes (con filtros)
// @access  Public
router.get('/', reportController.getAllReports);

// @route   GET /api/reports/my-reports
// @desc    Obtener reportes del usuario actual (alias)
// @access  Private
router.get('/my-reports', protect, reportController.getUserReports);

// @route   GET /api/reports/user
// @desc    Obtener reportes del usuario actual
// @access  Private
router.get('/user', protect, reportController.getUserReports);

// @route   GET /api/reports/nearby
// @desc    Obtener reportes cercanos
// @access  Public
router.get('/nearby', reportController.getNearbyReports);

// @route   GET /api/reports/:id
// @desc    Obtener reporte por ID
// @access  Public
router.get('/:id', reportController.getReportById);

// @route   POST /api/reports
// @desc    Crear nuevo reporte
// @access  Private
router.post(
  '/',
  protect,
  upload.array('images', 5),
  [
    body('type').notEmpty().withMessage('El tipo de reporte es requerido'),
    body('title').trim().notEmpty().withMessage('El título es requerido'),
    body('description').trim().notEmpty().withMessage('La descripción es requerida'),
    body('location.coordinates').isArray().withMessage('Las coordenadas son requeridas'),
  ],
  reportController.createReport
);

// @route   PUT /api/reports/:id
// @desc    Actualizar reporte
// @access  Private
router.put('/:id', protect, reportController.updateReport);

// @route   DELETE /api/reports/:id
// @desc    Eliminar reporte
// @access  Private
router.delete('/:id', protect, reportController.deleteReport);

// @route   POST /api/reports/:id/like
// @desc    Dar like a un reporte
// @access  Private
router.post('/:id/like', protect, reportController.likeReport);

// @route   POST /api/reports/:id/comment
// @desc    Comentar en un reporte
// @access  Private
router.post(
  '/:id/comment',
  protect,
  [body('text').trim().notEmpty().withMessage('El comentario no puede estar vacío')],
  reportController.addComment
);

module.exports = router;
