import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../config/constants';

// Haversine formula to calculate distance between two points
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

export const fetchCollectionPoints = createAsyncThunk(
  'collectionPoints/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/collection-points`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue('Error al cargar puntos de acopio');
    }
  }
);

export const findNearestPoint = createAsyncThunk(
  'collectionPoints/findNearest',
  async ({ latitude, longitude }, { getState, rejectWithValue }) => {
    try {
      const { points } = getState().collectionPoints;
      
      if (!points || points.length === 0) {
        return rejectWithValue('No hay puntos disponibles');
      }

      let nearestPoint = null;
      let minDistance = Infinity;

      points.forEach((point) => {
        const distance = calculateDistance(
          latitude,
          longitude,
          point.latitude,
          point.longitude
        );

        if (distance < minDistance) {
          minDistance = distance;
          nearestPoint = { ...point, distance };
        }
      });

      return nearestPoint;
    } catch (error) {
      return rejectWithValue('Error al buscar punto más cercano');
    }
  }
);

const collectionPointsSlice = createSlice({
  name: 'collectionPoints',
  initialState: {
    points: [],
    nearestPoint: null,
    selectedPoint: null,
    loading: false,
    error: null,
  },
  reducers: {
    selectPoint: (state, action) => {
      state.selectedPoint = action.payload;
    },
    clearNearestPoint: (state) => {
      state.nearestPoint = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all points
      .addCase(fetchCollectionPoints.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCollectionPoints.fulfilled, (state, action) => {
        state.loading = false;
        state.points = action.payload;
        state.error = null;
      })
      .addCase(fetchCollectionPoints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Find nearest
      .addCase(findNearestPoint.fulfilled, (state, action) => {
        state.nearestPoint = action.payload;
      })
      .addCase(findNearestPoint.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { selectPoint, clearNearestPoint } = collectionPointsSlice.actions;
export default collectionPointsSlice.reducer;
