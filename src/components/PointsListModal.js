import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../config/constants';

const { height } = Dimensions.get('window');

export default function PointsListModal({ visible, onClose, points, loading, onViewDetails }) {
  console.log('📋 PointsListModal render:', {
    visible,
    loading,
    pointsCount: points ? points.length : 0
  });

  // Función para abrir navegación automáticamente
  const openNavigation = async (point) => {
    const latitude = point.location?.coordinates[1] || point.latitude;
    const longitude = point.location?.coordinates[0] || point.longitude;
    const label = encodeURIComponent(point.name);

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

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'contenedor':
        return 'delete-variant';
      case 'centro de acopio':
      case 'centro_acopio':
        return 'recycle';
      case 'centro de reciclaje':
      case 'reciclaje':
        return 'factory';
      default:
        return 'map-marker';
    }
  };

  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'contenedor':
        return '#1976D2';
      case 'centro de acopio':
      case 'centro_acopio':
        return '#2E7D32';
      case 'centro de reciclaje':
      case 'reciclaje':
        return '#66BB6A';
      default:
        return '#FFA726';
    }
  };

  const formatOperatingHours = (hours) => {
    if (!hours) return 'No disponible';
    
    if (typeof hours === 'string') {
      return hours;
    }

    if (hours.weekdays && hours.weekend) {
      return `L-V: ${hours.weekdays}\nS-D: ${hours.weekend}`;
    }

    return 'No disponible';
  };

  const renderPoint = ({ item, index }) => {
    const typeColor = getTypeColor(item.type);
    const typeIcon = getTypeIcon(item.type);

    return (
      <View style={styles.pointCard}>
        <View style={styles.pointHeader}>
          <View style={[styles.iconContainer, { backgroundColor: typeColor }]}>
            <MaterialCommunityIcons name={typeIcon} size={28} color="white" />
          </View>
          <View style={styles.pointInfo}>
            <Text style={styles.pointName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.pointType}>{item.type}</Text>
          </View>
          <View style={styles.distanceContainer}>
            <MaterialCommunityIcons
              name="map-marker-distance"
              size={20}
              color={COLORS.primary}
            />
            <Text style={styles.distanceText}>
              {item.distanceKm ? `${item.distanceKm} km` : `${Math.round(item.distance)} m`}
            </Text>
          </View>
        </View>

        <View style={styles.pointDetails}>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="map-marker" size={16} color="#666" />
            <Text style={styles.detailText} numberOfLines={2}>
              {item.address}
            </Text>
          </View>

          {item.operating_hours && (
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="clock-outline" size={16} color="#666" />
              <Text style={styles.detailText}>
                {formatOperatingHours(item.operating_hours)}
              </Text>
            </View>
          )}

          {item.waste_types && item.waste_types.length > 0 && (
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="delete-variant" size={16} color="#666" />
              <View style={styles.wasteTypesContainer}>
                {item.waste_types.slice(0, 4).map((wasteType, idx) => (
                  <View key={idx} style={styles.wasteTypeBadge}>
                    <Text style={styles.wasteTypeText}>{wasteType}</Text>
                  </View>
                ))}
                {item.waste_types.length > 4 && (
                  <Text style={styles.moreText}>+{item.waste_types.length - 4} más</Text>
                )}
              </View>
            </View>
          )}

          {item.capacity && (
            <View style={styles.capacityContainer}>
              <View style={styles.capacityBar}>
                <View
                  style={[
                    styles.capacityFill,
                    {
                      width: `${((item.current_fill || 0) / item.capacity) * 100}%`,
                      backgroundColor:
                        (item.current_fill || 0) / item.capacity > 0.8
                          ? '#f44336'
                          : (item.current_fill || 0) / item.capacity > 0.5
                          ? '#FFA726'
                          : '#4CAF50',
                    },
                  ]}
                />
              </View>
              <Text style={styles.capacityText}>
                {item.current_fill || 0} / {item.capacity} kg
              </Text>
            </View>
          )}

          {/* Botones de acción */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={styles.navigationButton}
              onPress={() => openNavigation(item)}
            >
              <MaterialCommunityIcons name="navigation" size={18} color="white" />
              <Text style={styles.navigationButtonText}>Cómo llegar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.detailsButton}
              onPress={() => onViewDetails && onViewDetails(item)}
            >
              <MaterialCommunityIcons name="information-outline" size={18} color="white" />
              <Text style={styles.detailsButtonText}>Ver Detalles</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Puntos de Acopio Cercanos</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Buscando puntos cercanos...</Text>
            </View>
          ) : points && points.length > 0 ? (
            <>
              <Text style={styles.resultsText}>
                Se encontraron {points.length} puntos ordenados por distancia
              </Text>
              <FlatList
                data={points}
                renderItem={renderPoint}
                keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
              />
            </>
          ) : (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons
                name="map-marker-off"
                size={64}
                color="#ccc"
              />
              <Text style={styles.emptyText}>
                No se encontraron puntos de acopio cercanos
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: height * 0.75,
    paddingTop: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    position: 'absolute',
    top: 8,
    left: '50%',
    marginLeft: -20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  resultsText: {
    fontSize: 14,
    color: '#666',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  pointCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  pointHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  pointInfo: {
    flex: 1,
  },
  pointName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  pointType: {
    fontSize: 13,
    color: '#666',
  },
  distanceContainer: {
    alignItems: 'center',
  },
  distanceText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 2,
  },
  pointDetails: {
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  detailText: {
    fontSize: 13,
    color: '#666',
    flex: 1,
  },
  wasteTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    flex: 1,
  },
  wasteTypeBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  wasteTypeText: {
    fontSize: 11,
    color: '#2E7D32',
    fontWeight: '500',
  },
  moreText: {
    fontSize: 11,
    color: '#666',
    alignSelf: 'center',
  },
  capacityContainer: {
    marginTop: 8,
  },
  capacityBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  capacityFill: {
    height: '100%',
    borderRadius: 4,
  },
  capacityText: {
    fontSize: 11,
    color: '#666',
    textAlign: 'right',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  navigationButton: {
    flex: 1,
    backgroundColor: COLORS.info,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  navigationButtonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
  detailsButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  detailsButtonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
