import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../../config/constants';

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      console.log('🔐 Intentando login con:', credentials.email);
      console.log('📡 API URL:', API_URL);
      
      const response = await axios.post(
        `${API_URL}/auth/login`, 
        credentials,
        {
          timeout: 10000, // 10 segundos timeout
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      console.log('✅ Login exitoso:', response.data.user.name);
      await AsyncStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      console.error('❌ Error en login:', error.message);
      if (error.code === 'ECONNABORTED') {
        return rejectWithValue('Tiempo de espera agotado. Verifica tu conexión.');
      }
      if (error.code === 'ERR_NETWORK') {
        return rejectWithValue('No se puede conectar al servidor. Verifica que el backend esté ejecutándose.');
      }
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Error al iniciar sesión'
      );
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      await AsyncStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error al registrarse');
    }
  }
);

export const loadStoredUser = createAsyncThunk(
  'auth/loadStoredUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      return { ...response.data, token };
    } catch (error) {
      await AsyncStorage.removeItem('token');
      return rejectWithValue('Sesión expirada');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    points: 0,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.points = 0;
      AsyncStorage.removeItem('token');
    },
    updatePoints: (state, action) => {
      state.points = action.payload;
      if (state.user) {
        state.user.points = action.payload;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.points = action.payload.user.points || 0;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.points = 0;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Load stored user
      .addCase(loadStoredUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.points = action.payload.user.points || 0;
      })
      .addCase(loadStoredUser.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, updatePoints, clearError } = authSlice.actions;
export default authSlice.reducer;
