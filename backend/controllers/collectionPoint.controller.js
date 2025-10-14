const { query } = require('../config/postgres');
const { getCache, setCache } = require('../config/redis');

// @desc    Obtener todos los puntos de acopio
// @route   GET /api/collection-points
// @access  Public
exports.getAllPoints = async (req, res) => {
  try {
    // Intentar obtener del caché
    const cacheKey = 'all_collection_points';
    const cached = await getCache(cacheKey);
    
    if (cached) {
      return res.json({
        success: true,
        count: cached.length,
        data: cached,
        fromCache: true,
      });
    }

    const result = await query(`
      SELECT 
        id,
        name,
        description,
        address,
        type,
        capacity,
        current_fill,
        waste_types,
        ST_X(location::geometry) as longitude,
        ST_Y(location::geometry) as latitude,
        operating_hours,
        contact_phone,
        contact_email,
        is_active,
        image_url,
        created_at,
        updated_at
      FROM collection_points
      WHERE is_active = true
      ORDER BY name
    `);

    const points = result.rows.map(row => ({
      ...row,
      location: {
        type: 'Point',
        coordinates: [row.longitude, row.latitude],
      },
    }));

    // Guardar en caché por 1 hora
    await setCache(cacheKey, points, 3600);

    res.json({
      success: true,
      count: points.length,
      data: points,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener puntos de acopio',
      error: error.message,
    });
  }
};

// @desc    Obtener puntos ordenados por distancia
// @route   GET /api/collection-points/sorted-by-distance?lat=&lng=
// @access  Public
exports.getPointsSortedByDistance = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitud y longitud son requeridas',
      });
    }

    const result = await query(`
      SELECT 
        id,
        name,
        description,
        address,
        type,
        capacity,
        current_fill,
        waste_types,
        ST_X(location::geometry) as longitude,
        ST_Y(location::geometry) as latitude,
        operating_hours,
        contact_phone,
        contact_email,
        is_active,
        image_url,
        ST_Distance(
          location,
          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
        ) as distance
      FROM collection_points
      WHERE is_active = true
      ORDER BY distance ASC
    `, [lng, lat]);

    const points = result.rows.map(row => ({
      ...row,
      location: {
        type: 'Point',
        coordinates: [row.longitude, row.latitude],
      },
      distance: Math.round(row.distance), // distancia en metros
      distanceKm: (row.distance / 1000).toFixed(2), // distancia en km
    }));

    res.json({
      success: true,
      count: points.length,
      data: points,
      userLocation: {
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener puntos ordenados por distancia',
      error: error.message,
    });
  }
};

// @desc    Obtener punto más cercano
// @route   GET /api/collection-points/nearest?lat=&lng=
// @access  Public
exports.getNearestPoint = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitud y longitud son requeridas',
      });
    }

    const result = await query(`
      SELECT 
        id,
        name,
        description,
        address,
        type,
        capacity,
        current_fill,
        waste_types,
        ST_X(location::geometry) as longitude,
        ST_Y(location::geometry) as latitude,
        operating_hours,
        contact_phone,
        contact_email,
        is_active,
        image_url,
        ST_Distance(
          location,
          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
        ) as distance
      FROM collection_points
      WHERE is_active = true
      ORDER BY distance
      LIMIT 1
    `, [lng, lat]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No se encontraron puntos de acopio',
      });
    }

    const point = {
      ...result.rows[0],
      location: {
        type: 'Point',
        coordinates: [result.rows[0].longitude, result.rows[0].latitude],
      },
      distance: Math.round(result.rows[0].distance), // metros
    };

    res.json({
      success: true,
      data: point,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al buscar punto más cercano',
      error: error.message,
    });
  }
};

// @desc    Obtener puntos cercanos en un radio
// @route   GET /api/collection-points/nearby?lat=&lng=&radius=
// @access  Public
exports.getNearbyPoints = async (req, res) => {
  try {
    const { lat, lng, radius = 5000 } = req.query; // radio en metros, default 5km

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitud y longitud son requeridas',
      });
    }

    const result = await query(`
      SELECT 
        id,
        name,
        description,
        address,
        type,
        capacity,
        current_fill,
        waste_types,
        ST_X(location::geometry) as longitude,
        ST_Y(location::geometry) as latitude,
        operating_hours,
        contact_phone,
        contact_email,
        is_active,
        image_url,
        ST_Distance(
          location,
          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
        ) as distance
      FROM collection_points
      WHERE is_active = true
        AND ST_DWithin(
          location,
          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
          $3
        )
      ORDER BY distance
    `, [lng, lat, radius]);

    const points = result.rows.map(row => ({
      ...row,
      location: {
        type: 'Point',
        coordinates: [row.longitude, row.latitude],
      },
      distance: Math.round(row.distance),
    }));

    res.json({
      success: true,
      count: points.length,
      radius: parseInt(radius),
      data: points,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al buscar puntos cercanos',
      error: error.message,
    });
  }
};

// @desc    Obtener punto por ID
// @route   GET /api/collection-points/:id
// @access  Public
exports.getPointById = async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        id,
        name,
        description,
        address,
        type,
        capacity,
        current_fill,
        waste_types,
        ST_X(location::geometry) as longitude,
        ST_Y(location::geometry) as latitude,
        operating_hours,
        contact_phone,
        contact_email,
        is_active,
        image_url,
        created_at,
        updated_at
      FROM collection_points
      WHERE id = $1
    `, [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Punto de acopio no encontrado',
      });
    }

    const point = {
      ...result.rows[0],
      location: {
        type: 'Point',
        coordinates: [result.rows[0].longitude, result.rows[0].latitude],
      },
    };

    res.json({
      success: true,
      data: point,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener punto de acopio',
      error: error.message,
    });
  }
};

// @desc    Crear nuevo punto de acopio
// @route   POST /api/collection-points
// @access  Private/Admin
exports.createPoint = async (req, res) => {
  try {
    const {
      name,
      description,
      address,
      type,
      capacity,
      waste_types,
      latitude,
      longitude,
      operating_hours,
      contact_phone,
      contact_email,
      image_url,
    } = req.body;

    const result = await query(`
      INSERT INTO collection_points (
        name, description, address, type, capacity, waste_types,
        location, operating_hours, contact_phone, contact_email, image_url
      ) VALUES ($1, $2, $3, $4, $5, $6, ST_SetSRID(ST_MakePoint($7, $8), 4326)::geography, $9, $10, $11, $12)
      RETURNING *,
        ST_X(location::geometry) as longitude,
        ST_Y(location::geometry) as latitude
    `, [
      name, description, address, type, capacity, waste_types,
      longitude, latitude, operating_hours, contact_phone, contact_email, image_url
    ]);

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al crear punto de acopio',
      error: error.message,
    });
  }
};

// @desc    Actualizar punto de acopio
// @route   PUT /api/collection-points/:id
// @access  Private/Admin
exports.updatePoint = async (req, res) => {
  try {
    const {
      name,
      description,
      address,
      type,
      capacity,
      current_fill,
      waste_types,
      latitude,
      longitude,
      operating_hours,
      contact_phone,
      contact_email,
      is_active,
      image_url,
    } = req.body;

    const result = await query(`
      UPDATE collection_points
      SET 
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        address = COALESCE($3, address),
        type = COALESCE($4, type),
        capacity = COALESCE($5, capacity),
        current_fill = COALESCE($6, current_fill),
        waste_types = COALESCE($7, waste_types),
        location = CASE 
          WHEN $8 IS NOT NULL AND $9 IS NOT NULL 
          THEN ST_SetSRID(ST_MakePoint($9, $8), 4326)::geography
          ELSE location
        END,
        operating_hours = COALESCE($10, operating_hours),
        contact_phone = COALESCE($11, contact_phone),
        contact_email = COALESCE($12, contact_email),
        is_active = COALESCE($13, is_active),
        image_url = COALESCE($14, image_url),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $15
      RETURNING *,
        ST_X(location::geometry) as longitude,
        ST_Y(location::geometry) as latitude
    `, [
      name, description, address, type, capacity, current_fill, waste_types,
      latitude, longitude, operating_hours, contact_phone, contact_email,
      is_active, image_url, req.params.id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Punto de acopio no encontrado',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar punto de acopio',
      error: error.message,
    });
  }
};

// @desc    Eliminar punto de acopio
// @route   DELETE /api/collection-points/:id
// @access  Private/Admin
exports.deletePoint = async (req, res) => {
  try {
    const result = await query(`
      DELETE FROM collection_points
      WHERE id = $1
      RETURNING id
    `, [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Punto de acopio no encontrado',
      });
    }

    res.json({
      success: true,
      message: 'Punto de acopio eliminado',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar punto de acopio',
      error: error.message,
    });
  }
};
