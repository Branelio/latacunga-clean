const User = require('../models/User');
const Report = require('../models/Report');
const { query } = require('../config/postgres');

// @desc    Obtener estadísticas generales
// @route   GET /api/stats/overview
// @access  Private/Admin
exports.getOverview = async (req, res) => {
  try {
    // Estadísticas de usuarios
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: new Date(new Date().setDate(1)) },
    });

    // Estadísticas de reportes
    const totalReports = await Report.countDocuments();
    const pendingReports = await Report.countDocuments({ status: 'pendiente' });
    const resolvedReports = await Report.countDocuments({ status: 'resuelto' });
    const reportsThisMonth = await Report.countDocuments({
      createdAt: { $gte: new Date(new Date().setDate(1)) },
    });

    // Estadísticas de puntos de acopio
    const collectionPointsResult = await query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN is_active = true THEN 1 END) as active
      FROM collection_points
    `);

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          active: activeUsers,
          newThisMonth: newUsersThisMonth,
        },
        reports: {
          total: totalReports,
          pending: pendingReports,
          resolved: resolvedReports,
          thisMonth: reportsThisMonth,
        },
        collectionPoints: {
          total: parseInt(collectionPointsResult.rows[0].total),
          active: parseInt(collectionPointsResult.rows[0].active),
        },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas generales',
      error: error.message,
    });
  }
};

// @desc    Obtener estadísticas de reportes
// @route   GET /api/stats/reports
// @access  Private/Admin
exports.getReportsStats = async (req, res) => {
  try {
    // Reportes por tipo
    const byType = await Report.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Reportes por estado
    const byStatus = await Report.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Reportes por severidad
    const bySeverity = await Report.aggregate([
      { $group: { _id: '$severity', count: { $sum: 1 } } },
    ]);

    // Tendencia por mes (últimos 6 meses)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const trend = await Report.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.json({
      success: true,
      data: {
        byType,
        byStatus,
        bySeverity,
        trend,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas de reportes',
      error: error.message,
    });
  }
};

// @desc    Obtener estadísticas de usuarios
// @route   GET /api/stats/users
// @access  Private/Admin
exports.getUsersStats = async (req, res) => {
  try {
    // Usuarios por nivel
    const byLevel = await User.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$level', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Top 10 usuarios
    const topUsers = await User.find({ isActive: true })
      .select('name avatar points level stats')
      .sort({ points: -1 })
      .limit(10);

    // Nuevos usuarios (últimos 30 días)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newUsersCount = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    res.json({
      success: true,
      data: {
        byLevel,
        topUsers: topUsers.map((user, index) => ({
          rank: index + 1,
          id: user._id,
          name: user.name,
          avatar: user.avatarUrl,
          points: user.points,
          level: user.level,
          totalReports: user.stats.totalReports,
        })),
        newUsersLast30Days: newUsersCount,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas de usuarios',
      error: error.message,
    });
  }
};
