import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { COLORS } from '../config/constants';

const { width } = Dimensions.get('window');

export default function CollectionPointDetailScreen({ route, navigation }) {
  const { point } = route.params;

  const openInMaps = () => {
    const latitude = point.location.coordinates[1];
    const longitude = point.location.coordinates[0];
    const label = encodeURIComponent(point.name);

    const url = Platform.select({
      ios: `maps:0,0?q=${label}@${latitude},${longitude}`,
      android: `geo:0,0?q=${latitude},${longitude}(${label})`,
    });

    Linking.openURL(url);
  };

  const callPhone = () => {
    if (point.contact_phone) {
      Linking.openURL(`tel:${point.contact_phone}`);
    }
  };

  const sendEmail = () => {
    if (point.contact_email) {
      Linking.openURL(`mailto:${point.contact_email}`);
    }
  };

  const getCapacityPercentage = () => {
    if (!point.capacity || !point.current_fill) return 0;
    return (point.current_fill / point.capacity) * 100;
  };

  const getCapacityColor = () => {
    const percentage = getCapacityPercentage();
    if (percentage < 50) return COLORS.success;
    if (percentage < 80) return COLORS.warning;
    return COLORS.error;
  };

  return (
    <ScrollView style={styles.container}>
      {/* Imagen o Mapa */}
      {point.image_url ? (
        <Image source={{ uri: point.image_url }} style={styles.image} />
      ) : (
        <View style={styles.mapContainer}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{
              latitude: point.location.coordinates[1],
              longitude: point.location.coordinates[0],
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
          >
            <Marker
              coordinate={{
                latitude: point.location.coordinates[1],
                longitude: point.location.coordinates[0],
              }}
            >
              <View style={styles.markerContainer}>
                <MaterialCommunityIcons
                  name="delete-variant"
                  size={32}
                  color="white"
                />
              </View>
            </Marker>
          </MapView>
        </View>
      )}

      <View style={styles.content}>
        {/* Encabezado */}
        <View style={styles.header}>
          <Text style={styles.name}>{point.name}</Text>
          <Text style={styles.type}>{point.type || 'Punto de Acopio'}</Text>
        </View>

        {/* Descripción */}
        {point.description && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name="information"
                size={24}
                color={COLORS.primary}
              />
              <Text style={styles.sectionTitle}>Descripción</Text>
            </View>
            <Text style={styles.description}>{point.description}</Text>
          </View>
        )}

        {/* Dirección */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="map-marker"
              size={24}
              color={COLORS.primary}
            />
            <Text style={styles.sectionTitle}>Ubicación</Text>
          </View>
          <Text style={styles.address}>{point.address}</Text>
          <TouchableOpacity style={styles.directionsButton} onPress={openInMaps}>
            <MaterialCommunityIcons name="directions" size={20} color="white" />
            <Text style={styles.directionsButtonText}>Cómo llegar</Text>
          </TouchableOpacity>
        </View>

        {/* Capacidad */}
        {point.capacity && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name="gauge"
                size={24}
                color={COLORS.primary}
              />
              <Text style={styles.sectionTitle}>Capacidad</Text>
            </View>
            <View style={styles.capacityContainer}>
              <View style={styles.capacityBar}>
                <View
                  style={[
                    styles.capacityFill,
                    {
                      width: `${getCapacityPercentage()}%`,
                      backgroundColor: getCapacityColor(),
                    },
                  ]}
                />
              </View>
              <Text style={styles.capacityText}>
                {point.current_fill || 0} / {point.capacity} ({getCapacityPercentage().toFixed(0)}%)
              </Text>
            </View>
          </View>
        )}

        {/* Tipos de Residuos */}
        {point.waste_types && point.waste_types.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name="recycle"
                size={24}
                color={COLORS.primary}
              />
              <Text style={styles.sectionTitle}>Tipos de Residuos Aceptados</Text>
            </View>
            <View style={styles.wasteTypesContainer}>
              {point.waste_types.map((type, index) => (
                <View key={index} style={styles.wasteTypeBadge}>
                  <Text style={styles.wasteTypeBadgeText}>{type}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Horarios */}
        {point.operating_hours && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={24}
                color={COLORS.primary}
              />
              <Text style={styles.sectionTitle}>Horario de Atención</Text>
            </View>
            <View style={styles.hoursContainer}>
              {Object.entries(point.operating_hours).map(([day, hours]) => (
                <View key={day} style={styles.hourRow}>
                  <Text style={styles.dayText}>{day}:</Text>
                  <Text style={styles.hoursText}>{hours}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Contacto */}
        {(point.contact_phone || point.contact_email) && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name="phone"
                size={24}
                color={COLORS.primary}
              />
              <Text style={styles.sectionTitle}>Contacto</Text>
            </View>
            {point.contact_phone && (
              <TouchableOpacity style={styles.contactButton} onPress={callPhone}>
                <MaterialCommunityIcons
                  name="phone"
                  size={20}
                  color={COLORS.primary}
                />
                <Text style={styles.contactButtonText}>{point.contact_phone}</Text>
              </TouchableOpacity>
            )}
            {point.contact_email && (
              <TouchableOpacity style={styles.contactButton} onPress={sendEmail}>
                <MaterialCommunityIcons
                  name="email"
                  size={20}
                  color={COLORS.primary}
                />
                <Text style={styles.contactButtonText}>{point.contact_email}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Distancia (si está disponible) */}
        {point.distance !== undefined && (
          <View style={styles.distanceCard}>
            <MaterialCommunityIcons
              name="map-marker-distance"
              size={32}
              color={COLORS.primary}
            />
            <View style={styles.distanceInfo}>
              <Text style={styles.distanceLabel}>Distancia</Text>
              <Text style={styles.distanceValue}>
                {point.distance < 1000
                  ? `${Math.round(point.distance)} metros`
                  : `${(point.distance / 1000).toFixed(1)} km`}
              </Text>
            </View>
          </View>
        )}

        {/* Botón de Reportar Problema */}
        <TouchableOpacity
          style={styles.reportProblemButton}
          onPress={() =>
            navigation.navigate('Report', { collectionPointId: point.id })
          }
        >
          <MaterialCommunityIcons name="alert-circle" size={24} color="white" />
          <Text style={styles.reportProblemButtonText}>
            Reportar Problema en este Punto
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const { Platform } = require('react-native');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  image: {
    width: width,
    height: 250,
  },
  mapContainer: {
    width: width,
    height: 250,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 5,
  },
  type: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginLeft: 10,
  },
  description: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  address: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.info,
    padding: 12,
    borderRadius: 10,
    justifyContent: 'center',
  },
  directionsButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  capacityContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
  },
  capacityBar: {
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 10,
  },
  capacityFill: {
    height: '100%',
    borderRadius: 6,
  },
  capacityText: {
    fontSize: 14,
    color: COLORS.text,
    textAlign: 'center',
    fontWeight: '600',
  },
  wasteTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  wasteTypeBadge: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  wasteTypeBadgeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  hoursContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
  },
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    textTransform: 'capitalize',
  },
  hoursText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  contactButtonText: {
    fontSize: 15,
    color: COLORS.text,
    marginLeft: 12,
    fontWeight: '500',
  },
  distanceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  distanceInfo: {
    marginLeft: 15,
  },
  distanceLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  distanceValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  reportProblemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.accent,
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 20,
  },
  reportProblemButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
