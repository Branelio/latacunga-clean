import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../config/constants';

const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const submitReport = createAsyncThunk(
  'reports/submit',
  async (reportData, { rejectWithValue }) => {
    try {
      const config = await getAuthHeaders();
      const response = await axios.post(`${API_URL}/reports`, reportData, config);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear reporte');
    }
  }
);

export const fetchUserReports = createAsyncThunk(
  'reports/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const config = await getAuthHeaders();
      const response = await axios.get(`${API_URL}/reports/my-reports`, config);
      return response.data.data;
    } catch (error) {
      return rejectWithValue('Error al cargar reportes');
    }
  }
);

export const fetchNearbyReports = createAsyncThunk(
  'reports/fetchNearby',
  async ({ latitude, longitude, radius = 5000 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/reports/nearby?lat=${latitude}&lng=${longitude}&radius=${radius}`
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue('Error al cargar reportes cercanos');
    }
  }
);

const reportsSlice = createSlice({
  name: 'reports',
  initialState: {
    userReports: [],
    nearbyReports: [],
    selectedReport: null,
    loading: false,
    error: null,
  },
  reducers: {
    selectReport: (state, action) => {
      state.selectedReport = action.payload;
    },
    clearReports: (state) => {
      state.userReports = [];
      state.nearbyReports = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Submit report
      .addCase(submitReport.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitReport.fulfilled, (state, action) => {
        state.loading = false;
        state.userReports.unshift(action.payload);
        state.error = null;
      })
      .addCase(submitReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch user reports
      .addCase(fetchUserReports.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserReports.fulfilled, (state, action) => {
        state.loading = false;
        state.userReports = action.payload;
        state.error = null;
      })
      .addCase(fetchUserReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch nearby reports
      .addCase(fetchNearbyReports.fulfilled, (state, action) => {
        state.nearbyReports = action.payload;
      });
  },
});

export const { selectReport, clearReports } = reportsSlice.actions;
export default reportsSlice.reducer;
