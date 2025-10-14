const express = require('express');
const router = express.Router();
const collectionPointController = require('../controllers/collectionPoint.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// @route   GET /api/collection-points
// @desc    Obtener todos los puntos de acopio
// @access  Public
router.get('/', collectionPointController.getAllPoints);

// @route   GET /api/collection-points/sorted-by-distance
// @desc    Obtener todos los puntos ordenados por distancia
// @access  Public
router.get('/sorted-by-distance', collectionPointController.getPointsSortedByDistance);

// @route   GET /api/collection-points/nearest
// @desc    Obtener punto más cercano
// @access  Public
router.get('/nearest', collectionPointController.getNearestPoint);

// @route   GET /api/collection-points/nearby
// @desc    Obtener puntos cercanos en un radio
// @access  Public
router.get('/nearby', collectionPointController.getNearbyPoints);

// @route   GET /api/collection-points/:id
// @desc    Obtener punto por ID
// @access  Public
router.get('/:id', collectionPointController.getPointById);

// @route   POST /api/collection-points
// @desc    Crear nuevo punto de acopio
// @access  Private/Admin
router.post('/', protect, authorize('admin'), collectionPointController.createPoint);

// @route   PUT /api/collection-points/:id
// @desc    Actualizar punto de acopio
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), collectionPointController.updatePoint);

// @route   DELETE /api/collection-points/:id
// @desc    Eliminar punto de acopio
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), collectionPointController.deletePoint);

module.exports = router;
