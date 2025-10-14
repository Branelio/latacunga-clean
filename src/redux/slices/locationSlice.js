import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as Location from 'expo-location';
import { INITIAL_REGION } from '../../config/constants';

export const requestLocationPermission = createAsyncThunk(
  'location/requestPermission',
  async (_, { rejectWithValue }) => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return rejectWithValue('Permiso de ubicación denegado');
      }
      return status;
    } catch (error) {
      return rejectWithValue('Error al solicitar permisos');
    }
  }
);

export const getCurrentLocation = createAsyncThunk(
  'location/getCurrent',
  async (_, { rejectWithValue }) => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        altitude: location.coords.altitude,
        accuracy: location.coords.accuracy,
        timestamp: location.timestamp,
      };
    } catch (error) {
      return rejectWithValue('No se pudo obtener la ubicación');
    }
  }
);

const locationSlice = createSlice({
  name: 'location',
  initialState: {
    currentLocation: null,
    region: INITIAL_REGION,
    permissionGranted: false,
    loading: false,
    error: null,
  },
  reducers: {
    updateLocation: (state, action) => {
      state.currentLocation = action.payload;
      state.region = {
        ...state.region,
        latitude: action.payload.latitude,
        longitude: action.payload.longitude,
      };
    },
    setRegion: (state, action) => {
      state.region = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Request permission
      .addCase(requestLocationPermission.fulfilled, (state) => {
        state.permissionGranted = true;
        state.error = null;
      })
      .addCase(requestLocationPermission.rejected, (state, action) => {
        state.permissionGranted = false;
        state.error = action.payload;
      })
      // Get current location
      .addCase(getCurrentLocation.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.currentLocation = action.payload;
        state.region = {
          ...state.region,
          latitude: action.payload.latitude,
          longitude: action.payload.longitude,
        };
        state.error = null;
      })
      .addCase(getCurrentLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateLocation, setRegion } = locationSlice.actions;
export default locationSlice.reducer;
