const express = require('express');
const router = express.Router();
const statsController = require('../controllers/stats.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// @route   GET /api/stats/overview
// @desc    Obtener estadísticas generales
// @access  Private/Admin
router.get('/overview', protect, authorize('admin'), statsController.getOverview);

// @route   GET /api/stats/reports
// @desc    Obtener estadísticas de reportes
// @access  Private/Admin
router.get('/reports', protect, authorize('admin'), statsController.getReportsStats);

// @route   GET /api/stats/users
// @desc    Obtener estadísticas de usuarios
// @access  Private/Admin
router.get('/users', protect, authorize('admin'), statsController.getUsersStats);

module.exports = router;
