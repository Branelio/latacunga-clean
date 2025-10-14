import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  Linking,
  Platform,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from 'react-native-maps';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {
  requestLocationPermission,
  getCurrentLocation,
} from '../redux/slices/locationSlice';
import {
  fetchCollectionPoints,
  findNearestPoint,
} from '../redux/slices/collectionPointsSlice';
import { COLORS, WASTE_TYPES, API_URL } from '../config/constants';
import PointsListModal from '../components/PointsListModal';

const { width, height } = Dimensions.get('window');

export default function MapScreen({ navigation }) {
  const dispatch = useDispatch();
  const mapRef = useRef(null);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [showPointsModal, setShowPointsModal] = useState(false);
  const [sortedPoints, setSortedPoints] = useState([]);
  const [loadingSortedPoints, setLoadingSortedPoints] = useState(false);

  const { currentLocation, region, loading: locationLoading } = useSelector(
    (state) => state.location
  );
  const { points, nearestPoint, loading: pointsLoading } = useSelector(
    (state) => state.collectionPoints
  );

  useEffect(() => {
    initializeMap();
  }, []);



  const initializeMap = async () => {
    await dispatch(requestLocationPermission());
    await dispatch(getCurrentLocation());
    await dispatch(fetchCollectionPoints());
  };

  const handleFindNearest = async () => {
    console.log('🔍 handleFindNearest called');
    console.log('📍 currentLocation:', currentLocation);
    
    if (!currentLocation) {
      Alert.alert('Error', 'No se pudo obtener tu ubicación');
      return;
    }

    try {
      setLoadingSortedPoints(true);
      setShowPointsModal(true);

      console.log('🌐 Calling API with:', {
        lat: currentLocation.latitude,
        lng: currentLocation.longitude,
        url: `${API_URL}/collection-points/sorted-by-distance`
      });

      // Llamar al endpoint que devuelve puntos ordenados por distancia
      const response = await axios.get(
        `${API_URL}/collection-points/sorted-by-distance?lat=${currentLocation.latitude}&lng=${currentLocation.longitude}`
      );

      console.log('📡 API Response:', {
        success: response.data.success,
        count: response.data.count,
        dataLength: response.data.data ? response.data.data.length : 0
      });

      if (response.data.success && response.data.data && response.data.data.length > 0) {
        setSortedPoints(response.data.data);
        console.log('✅ Points set:', response.data.data.length);
        
        // Animar al punto más cercano en el mapa
        const nearest = response.data.data[0];
        mapRef.current?.animateToRegion(
          {
            latitude: nearest.location.coordinates[1],
            longitude: nearest.location.coordinates[0],
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
          1000
        );
      } else {
        // Si no hay puntos cercanos, mostrar todos los puntos disponibles
        console.log('⚠️ No nearby points, showing all available points');
        setSortedPoints(points || []);
        Alert.alert(
          'Puntos de Acopio', 
          'No se encontraron puntos cercanos a tu ubicación. Mostrando todos los puntos disponibles.',
          [{ text: 'Entendido' }]
        );
      }
    } catch (error) {
      console.error('❌ Error al buscar puntos cercanos:', error);
      console.error('❌ Error details:', error.response?.data || error.message);
      Alert.alert('Error', 'No se pudieron cargar los puntos de acopio');
    } finally {
      setLoadingSortedPoints(false);
    }
  };

  const handleMyLocation = async () => {
    const result = await dispatch(getCurrentLocation());
    if (result.payload) {
      mapRef.current?.animateToRegion(result.payload, 1000);
    }
  };

  const openNavigation = async (point) => {
    const latitude = point.location?.coordinates[1] || point.latitude;
    const longitude = point.location?.coordinates[0] || point.longitude;

    Alert.alert(
      'Navegación',
      `¿Quieres navegar a ${point.name}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Navegar',
          onPress: async () => {
            // Intentar Waze primero
            const wazeUrl = `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes&z=10`;
            const wazeSupported = await Linking.canOpenURL(wazeUrl).catch(() => false);
            
            if (wazeSupported) {
              Linking.openURL(wazeUrl);
              return;
            }

            // Si Waze no está disponible, usar Google Maps
            const googleUrl = Platform.select({
              ios: `maps://app?daddr=${latitude},${longitude}`,
              android: `google.navigation:q=${latitude},${longitude}`,
            });
            
            const googleSupported = await Linking.canOpenURL(googleUrl).catch(() => false);
            
            if (googleSupported) {
              Linking.openURL(googleUrl);
            } else {
              // Fallback a Google Maps web
              const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
              Linking.openURL(webUrl);
            }
          },
        },
      ]
    );
  };

  const getMarkerIcon = useCallback((type) => {
    const typeNormalized = type?.toLowerCase().replace(/\s+/g, '_');
    
    switch (typeNormalized) {
      case 'centro_de_acopio':
      case 'centro_acopio':
        return 'recycle';
      case 'contenedor':
        return 'delete';
      case 'centro_de_reciclaje':
      case 'reciclaje':
        return 'factory';
      default:
        return 'map-marker';
    }
  }, []);

  const getMarkerColor = useCallback((type) => {
    const typeNormalized = type?.toLowerCase().replace(/\s+/g, '_');
    
    switch (typeNormalized) {
      case 'centro_de_acopio':
      case 'centro_acopio':
        return '#2E7D32'; // Verde oscuro
      case 'contenedor':
        return '#1976D2'; // Azul
      case 'centro_de_reciclaje':
      case 'reciclaje':
        return '#66BB6A'; // Verde claro
      default:
        return '#FFA726'; // Naranja
    }
  }, []);

  // Función para obtener color del pin basado en el tipo (colores válidos para pinColor)
  const getPinColor = useCallback((type) => {
    const typeNormalized = type?.toLowerCase().replace(/\s+/g, '_');
    
    switch (typeNormalized) {
      case 'centro_de_acopio':
      case 'centro_acopio':
        return 'green'; // Verde para centros de acopio
      case 'contenedor':
        return 'blue'; // Azul para contenedores
      case 'centro_de_reciclaje':
      case 'reciclaje':
        return 'orange'; // Naranja para centros de reciclaje
      default:
        return 'red'; // Rojo por defecto
    }
  }, []);

  // Componente simple para marcadores
  const CollectionPointMarker = React.memo(({ point, onMarkerPress, onCalloutPress }) => {
    const pinColor = getPinColor(point.type);
    
    return (
      <Marker
        coordinate={{
          latitude: point.location.coordinates[1],
          longitude: point.location.coordinates[0],
        }}
        title={point.name}
        description={`${point.type} - ${point.address}`}
        pinColor={pinColor}
        onPress={() => onMarkerPress(point)}
        onCalloutPress={() => onCalloutPress(point)}
      />
    );
  });

  const handleMarkerPress = useCallback((point) => {
    setSelectedPoint(point);
  }, []);

  const handleCalloutPress = useCallback((point) => {
    navigation.navigate('CollectionPointDetail', { point });
  }, [navigation]);



  if (locationLoading || pointsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando mapa...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={true}
        showsScale={true}
      >
        {/* Marcador de ubicación actual */}
        {currentLocation && (
          <Marker
            key="user-location"
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
            title="Mi Ubicación"
            tracksViewChanges={false}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={styles.currentLocationMarker}>
              <View style={styles.currentLocationInner} />
            </View>
          </Marker>
        )}

        {/* Marcadores de puntos de acopio */}
        {points && points.length > 0 && points.map((point) => (
          <CollectionPointMarker 
            key={`marker-${point.id}`}
            point={point}
            onMarkerPress={handleMarkerPress}
            onCalloutPress={handleCalloutPress}
          />
        ))}
      </MapView>

      {/* Botón para encontrar punto más cercano */}
      <TouchableOpacity
        style={styles.findNearestButton}
        onPress={handleFindNearest}
      >
        <MaterialCommunityIcons name="map-marker-radius" size={24} color="white" />
        <Text style={styles.findNearestText}>Punto Más Cercano</Text>
      </TouchableOpacity>



      {/* Botón de mi ubicación */}
      <TouchableOpacity
        style={styles.myLocationButton}
        onPress={handleMyLocation}
      >
        <MaterialCommunityIcons name="crosshairs-gps" size={28} color={COLORS.primary} />
      </TouchableOpacity>

      {/* Botón para reportar */}
      <TouchableOpacity
        style={styles.reportButton}
        onPress={() => navigation.navigate('Report')}
      >
        <MaterialCommunityIcons name="alert-circle" size={28} color="white" />
      </TouchableOpacity>

      {/* Información del punto seleccionado */}
      {selectedPoint && (
        <View style={styles.pointInfoCard}>
          <View style={styles.pointInfoHeader}>
            <View>
              <Text style={styles.pointInfoName}>{selectedPoint.name}</Text>
              <Text style={styles.pointInfoAddress}>
                {selectedPoint.address}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setSelectedPoint(null)}
              style={styles.closeButton}
            >
              <MaterialCommunityIcons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          {selectedPoint.distance && (
            <View style={styles.distanceContainer}>
              <MaterialCommunityIcons
                name="map-marker-distance"
                size={20}
                color={COLORS.primary}
              />
              <Text style={styles.distanceText}>
                A {Math.round(selectedPoint.distance)} metros de distancia
              </Text>
            </View>
          )}

          {selectedPoint.waste_types && (
            <View style={styles.wasteTypesContainer}>
              <Text style={styles.wasteTypesLabel}>Acepta:</Text>
              <View style={styles.wasteTypesList}>
                {selectedPoint.waste_types.slice(0, 3).map((type, index) => (
                  <View key={index} style={styles.wasteTypeBadge}>
                    <Text style={styles.wasteTypeBadgeText}>{type}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={styles.navigationButton}
              onPress={() => openNavigation(selectedPoint)}
            >
              <MaterialCommunityIcons name="navigation" size={20} color="white" />
              <Text style={styles.navigationButtonText}>Cómo llegar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.viewDetailsButton}
              onPress={() =>
                navigation.navigate('CollectionPointDetail', {
                  point: selectedPoint,
                })
              }
            >
              <Text style={styles.viewDetailsButtonText}>Ver Detalles</Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                color="white"
              />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Modal de lista de puntos ordenados por distancia */}
      <PointsListModal
        visible={showPointsModal}
        onClose={() => setShowPointsModal(false)}
        points={sortedPoints}
        loading={loadingSortedPoints}
        onViewDetails={(point) => {
          setShowPointsModal(false);
          navigation.navigate('CollectionPointDetail', { point });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  map: {
    width: width,
    height: height,
  },
  currentLocationMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(46, 125, 50, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentLocationInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: 'white',
  },
  markerContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    overflow: 'visible',
  },
  calloutContainer: {
    width: 220,
    padding: 12,
  },
  calloutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
    color: COLORS.text,
  },
  calloutAddress: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 8,
    lineHeight: 16,
  },
  calloutTypeContainer: {
    marginBottom: 8,
  },
  calloutTypeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  calloutType: {
    fontSize: 11,
    color: 'white',
    fontWeight: '600',
  },
  calloutLink: {
    fontSize: 12,
    color: COLORS.info,
    fontWeight: 'bold',
  },
  findNearestButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  findNearestText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  myLocationButton: {
    position: 'absolute',
    top: 80,
    right: 10,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  reportButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  pointInfoCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  pointInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  pointInfoName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 5,
  },
  pointInfoAddress: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  closeButton: {
    padding: 5,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    backgroundColor: COLORS.background,
    borderRadius: 10,
  },
  distanceText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 8,
    fontWeight: '500',
  },
  wasteTypesContainer: {
    marginBottom: 15,
  },
  wasteTypesLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  wasteTypesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  wasteTypeBadge: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  wasteTypeBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  navigationButton: {
    flex: 1,
    backgroundColor: COLORS.info,
    borderRadius: 10,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  navigationButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  viewDetailsButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  viewDetailsButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
