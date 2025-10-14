import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import * as Notifications from 'expo-notifications';
import { Alert, Linking, Platform } from 'react-native';

/**
 * Solicitar permisos de ubicación
 */
export const requestLocationPermission = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permisos de ubicación',
        'Para usar esta función necesitamos acceso a tu ubicación.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Abrir Configuración', 
            onPress: () => Linking.openSettings() 
          },
        ]
      );
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return false;
  }
};

/**
 * Verificar si los permisos de ubicación están otorgados
 */
export const checkLocationPermission = async () => {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error checking location permission:', error);
    return false;
  }
};

/**
 * Solicitar permisos de cámara
 */
export const requestCameraPermission = async () => {
  try {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permisos de cámara',
        'Para tomar fotos necesitamos acceso a tu cámara.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Abrir Configuración', 
            onPress: () => Linking.openSettings() 
          },
        ]
      );
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error requesting camera permission:', error);
    return false;
  }
};

/**
 * Solicitar permisos de galería
 */
export const requestMediaLibraryPermission = async () => {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permisos de galería',
        'Para seleccionar fotos necesitamos acceso a tu galería.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Abrir Configuración', 
            onPress: () => Linking.openSettings() 
          },
        ]
      );
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error requesting media library permission:', error);
    return false;
  }
};

/**
 * Solicitar permisos de notificaciones
 */
export const requestNotificationPermission = async () => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      Alert.alert(
        'Permisos de notificaciones',
        'Para recibir notificaciones necesitamos tu permiso.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Abrir Configuración', 
            onPress: () => Linking.openSettings() 
          },
        ]
      );
      return false;
    }
    
    // Configurar canal de notificaciones en Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#4CAF50',
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

/**
 * Obtener ubicación actual
 */
export const getCurrentLocation = async () => {
  try {
    const hasPermission = await requestLocationPermission();
    
    if (!hasPermission) {
      return null;
    }
    
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy,
    };
  } catch (error) {
    console.error('Error getting current location:', error);
    return null;
  }
};

/**
 * Verificar todos los permisos necesarios al inicio
 */
export const checkAllPermissions = async () => {
  const permissions = {
    location: await checkLocationPermission(),
    camera: false,
    gallery: false,
    notifications: false,
  };
  
  try {
    const cameraStatus = await ImagePicker.getCameraPermissionsAsync();
    permissions.camera = cameraStatus.status === 'granted';
    
    const galleryStatus = await ImagePicker.getMediaLibraryPermissionsAsync();
    permissions.gallery = galleryStatus.status === 'granted';
    
    const notificationStatus = await Notifications.getPermissionsAsync();
    permissions.notifications = notificationStatus.status === 'granted';
  } catch (error) {
    console.error('Error checking permissions:', error);
  }
  
  return permissions;
};
