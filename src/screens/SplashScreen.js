import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { loadStoredUser } from '../redux/slices/authSlice';
import { COLORS } from '../config/constants';

export default function SplashScreen({ navigation }) {
  const dispatch = useDispatch();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      await dispatch(loadStoredUser()).unwrap();
      setTimeout(() => navigation.replace('Main'), 2000);
    } catch (error) {
      setTimeout(() => navigation.replace('Login'), 2000);
    }
  };

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons 
        name="recycle" 
        size={100} 
        color={COLORS.primary} 
      />
      <Text style={styles.title}>Latacunga Clean</Text>
      <Text style={styles.subtitle}>Gestión Inteligente de Residuos</Text>
      <ActivityIndicator 
        size="large" 
        color={COLORS.primary} 
        style={styles.loader} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  loader: {
    marginTop: 40,
  },
});
