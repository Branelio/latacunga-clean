const User = require('../models/User');
const Report = require('../models/Report');

// @desc    Obtener tabla de líderes
// @route   GET /api/users/leaderboard
// @access  Public
exports.getLeaderboard = async (req, res) => {
  try {
    const { limit = 50, period = 'all' } = req.query;

    const users = await User.find({ isActive: true })
      .select('name avatar points level stats createdAt')
      .sort({ points: -1 })
      .limit(parseInt(limit));

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      id: user._id,
      name: user.name,
      avatar: user.avatarUrl,
      points: user.points,
      level: user.level,
      totalReports: user.stats.totalReports,
      verifiedReports: user.stats.verifiedReports,
    }));

    res.json({
      success: true,
      count: leaderboard.length,
      data: leaderboard,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener tabla de líderes',
      error: error.message,
    });
  }
};

// @desc    Obtener perfil de usuario por ID
// @route   GET /api/users/profile/:id
// @access  Public
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    // Obtener reportes recientes del usuario
    const recentReports = await Report.find({
      user: user._id,
      visibility: 'public',
    })
      .select('title type status createdAt images')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          avatar: user.avatarUrl,
          points: user.points,
          level: user.level,
          stats: user.stats,
          createdAt: user.createdAt,
        },
        recentReports,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener perfil de usuario',
      error: error.message,
    });
  }
};

// @desc    Obtener estadísticas del usuario actual
// @route   GET /api/users/stats
// @access  Private
exports.getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // Estadísticas de reportes por estado
    const reportsByStatus = await Report.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Estadísticas de reportes por tipo
    const reportsByType = await Report.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$type', count: { $sum: 1 } } },
    ]);

    // Posición en el ranking
    const rank = await User.countDocuments({ 
      points: { $gt: user.points },
      isActive: true,
    }) + 1;

    res.json({
      success: true,
      data: {
        points: user.points,
        level: user.level,
        rank,
        stats: user.stats,
        reportsByStatus,
        reportsByType,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas',
      error: error.message,
    });
  }
};
