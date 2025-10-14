import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import locationReducer from './slices/locationSlice';
import collectionPointsReducer from './slices/collectionPointsSlice';
import reportsReducer from './slices/reportsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    location: locationReducer,
    collectionPoints: collectionPointsReducer,
    reports: reportsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['location/getCurrentLocation/fulfilled'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['location.timestamp'],
      },
    }),
});

export default store;
