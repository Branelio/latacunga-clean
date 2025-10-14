import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { Alert } from 'react-native';

/**
 * Offline Service
 * Maneja sincronización, caché y detección de conectividad
 */

class OfflineService {
  constructor() {
    this.isOnline = true;
    this.syncQueue = [];
    this.listeners = [];
  }

  /**
   * Inicializar servicio offline
   */
  async init() {
    // Verificar estado de red
    const netInfo = await NetInfo.fetch();
    this.isOnline = netInfo.isConnected;

    // Listener de cambios de conectividad
    NetInfo.addEventListener(state => {
      const wasOnline = this.isOnline;
      this.isOnline = state.isConnected;

      console.log('Network status:', state.isConnected ? 'Online' : 'Offline');

      // Si acabamos de conectarnos, sincronizar
      if (!wasOnline && this.isOnline) {
        this.syncPendingRequests();
      }

      // Notificar a listeners
      this.notifyListeners(this.isOnline);
    });

    // Cargar cola de sincronización
    await this.loadSyncQueue();
  }

  /**
   * Verificar si hay conexión
   */
  checkConnection() {
    return this.isOnline;
  }

  /**
   * Agregar listener de cambios de conectividad
   */
  addConnectionListener(callback) {
    this.listeners.push(callback);
  }

  /**
   * Remover listener
   */
  removeConnectionListener(callback) {
    this.listeners = this.listeners.filter(cb => cb !== callback);
  }

  /**
   * Notificar a todos los listeners
   */
  notifyListeners(isOnline) {
    this.listeners.forEach(callback => callback(isOnline));
  }

  /**
   * Guardar datos en caché
   */
  async saveToCache(key, data) {
    try {
      const cacheKey = `cache_${key}`;
      await AsyncStorage.setItem(cacheKey, JSON.stringify({
        data,
        timestamp: new Date().toISOString(),
      }));
      console.log('✅ Data cached:', key);
    } catch (error) {
      console.error('Error saving to cache:', error);
    }
  }

  /**
   * Obtener datos de caché
   */
  async getFromCache(key, maxAgeMinutes = 60) {
    try {
      const cacheKey = `cache_${key}`;
      const cached = await AsyncStorage.getItem(cacheKey);
      
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      const age = (new Date() - new Date(timestamp)) / 1000 / 60; // minutos

      if (age > maxAgeMinutes) {
        console.log('⏰ Cache expired:', key);
        return null;
      }

      console.log('✅ Data from cache:', key);
      return data;
    } catch (error) {
      console.error('Error reading from cache:', error);
      return null;
    }
  }

  /**
   * Limpiar caché
   */
  async clearCache() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith('cache_'));
      await AsyncStorage.multiRemove(cacheKeys);
      console.log('🗑️ Cache cleared');
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  /**
   * Agregar petición a la cola de sincronización
   */
  async addToSyncQueue(request) {
    try {
      this.syncQueue.push({
        ...request,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      });

      await this.saveSyncQueue();
      console.log('📥 Request added to sync queue:', request.type);

      // Si estamos online, intentar sincronizar inmediatamente
      if (this.isOnline) {
        await this.syncPendingRequests();
      }
    } catch (error) {
      console.error('Error adding to sync queue:', error);
    }
  }

  /**
   * Guardar cola de sincronización
   */
  async saveSyncQueue() {
    try {
      await AsyncStorage.setItem('syncQueue', JSON.stringify(this.syncQueue));
    } catch (error) {
      console.error('Error saving sync queue:', error);
    }
  }

  /**
   * Cargar cola de sincronización
   */
  async loadSyncQueue() {
    try {
      const queue = await AsyncStorage.getItem('syncQueue');
      this.syncQueue = queue ? JSON.parse(queue) : [];
      console.log(`📋 Sync queue loaded: ${this.syncQueue.length} items`);
    } catch (error) {
      console.error('Error loading sync queue:', error);
      this.syncQueue = [];
    }
  }

  /**
   * Sincronizar peticiones pendientes
   */
  async syncPendingRequests() {
    if (!this.isOnline || this.syncQueue.length === 0) {
      return;
    }

    console.log(`🔄 Syncing ${this.syncQueue.length} pending requests...`);

    const failedRequests = [];

    for (const request of this.syncQueue) {
      try {
        // Aquí deberías hacer la petición real a tu API
        console.log('📤 Syncing request:', request.type);
        
        // Ejemplo:
        // await api.post(request.endpoint, request.data);
        
        // Simular éxito
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error('Error syncing request:', error);
        failedRequests.push(request);
      }
    }

    // Actualizar cola con peticiones fallidas
    this.syncQueue = failedRequests;
    await this.saveSyncQueue();

    if (failedRequests.length === 0) {
      console.log('✅ All requests synced successfully');
    } else {
      console.log(`⚠️ ${failedRequests.length} requests failed to sync`);
    }
  }

  /**
   * Obtener número de peticiones pendientes
   */
  getPendingRequestsCount() {
    return this.syncQueue.length;
  }

  /**
   * Mostrar notificación offline
   */
  showOfflineNotification() {
    Alert.alert(
      'Sin conexión',
      'No tienes conexión a internet. Los cambios se guardarán y sincronizarán cuando vuelvas a estar conectado.',
      [{ text: 'Entendido' }]
    );
  }

  /**
   * Limpiar cola de sincronización
   */
  async clearSyncQueue() {
    this.syncQueue = [];
    await this.saveSyncQueue();
    console.log('🗑️ Sync queue cleared');
  }
}

export default new OfflineService();
