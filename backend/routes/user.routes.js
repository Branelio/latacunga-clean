const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

// @route   GET /api/users/leaderboard
// @desc    Obtener tabla de líderes
// @access  Public
router.get('/leaderboard', userController.getLeaderboard);

// @route   GET /api/users/profile/:id
// @desc    Obtener perfil de usuario por ID
// @access  Public
router.get('/profile/:id', userController.getUserProfile);

// @route   GET /api/users/stats
// @desc    Obtener estadísticas del usuario actual
// @access  Private
router.get('/stats', protect, userController.getUserStats);

module.exports = router;
