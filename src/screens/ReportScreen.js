import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { submitReport } from '../redux/slices/reportsSlice';
import { COLORS, REPORT_TYPES } from '../config/constants';

export default function ReportScreen({ navigation }) {
  const dispatch = useDispatch();
  const { currentLocation } = useSelector((state) => state.location);
  const { loading } = useSelector((state) => state.reports);

  const [selectedType, setSelectedType] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('media');
  const [address, setAddress] = useState('');
  const [images, setImages] = useState([]);

  const severityLevels = [
    { id: 'baja', label: 'Baja', color: COLORS.info },
    { id: 'media', label: 'Media', color: COLORS.warning },
    { id: 'alta', label: 'Alta', color: COLORS.accent },
    { id: 'critica', label: 'Crítica', color: COLORS.error },
  ];

  const handleSubmit = async () => {
    if (!selectedType) {
      Alert.alert('Error', 'Por favor selecciona el tipo de reporte');
      return;
    }

    if (!title.trim()) {
      Alert.alert('Error', 'Por favor ingresa un título');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Por favor ingresa una descripción');
      return;
    }

    if (!currentLocation) {
      Alert.alert(
        'Error',
        'No se pudo obtener tu ubicación. Por favor activa el GPS.'
      );
      return;
    }

    try {
      const reportData = {
        type: selectedType,
        title: title.trim(),
        description: description.trim(),
        location: {
          type: 'Point',
          coordinates: [currentLocation.longitude, currentLocation.latitude],
          address: address.trim() || 'Ubicación desde GPS',
        },
        severity,
      };

      await dispatch(submitReport(reportData)).unwrap();

      Alert.alert(
        '¡Éxito!',
        'Tu reporte ha sido enviado exitosamente. ¡Has ganado 10 puntos!',
        [
          {
            text: 'Ver Reportes',
            onPress: () => navigation.navigate('Reports'),
          },
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );

      // Limpiar formulario
      setSelectedType(null);
      setTitle('');
      setDescription('');
      setSeverity('media');
      setAddress('');
      setImages([]);
    } catch (error) {
      Alert.alert('Error', 'No se pudo enviar el reporte. Intenta nuevamente.');
    }
  };

  const pickImageFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permisos requeridos',
          'Necesitamos permiso para acceder a tus fotos'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        maxWidth: 1200,
        maxHeight: 1200,
      });

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map(asset => asset.uri);
        setImages([...images, ...newImages].slice(0, 5)); // Máximo 5 imágenes
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la imagen');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permisos requeridos',
          'Necesitamos permiso para usar la cámara'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        quality: 0.8,
        maxWidth: 1200,
        maxHeight: 1200,
      });

      if (!result.canceled && result.assets) {
        setImages([...images, result.assets[0].uri].slice(0, 5));
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo tomar la foto');
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Encabezado */}
        <View style={styles.header}>
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={60}
            color={COLORS.primary}
          />
          <Text style={styles.headerTitle}>Reportar Problema</Text>
          <Text style={styles.headerSubtitle}>
            Ayúdanos a mantener Latacunga limpia reportando problemas
          </Text>
        </View>

        {/* Tipo de Reporte */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tipo de Reporte *</Text>
          <View style={styles.typeGrid}>
            {REPORT_TYPES.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.typeCard,
                  selectedType === type.id && styles.typeCardSelected,
                ]}
                onPress={() => setSelectedType(type.id)}
              >
                <MaterialCommunityIcons
                  name={type.icon}
                  size={32}
                  color={
                    selectedType === type.id ? COLORS.primary : COLORS.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.typeLabel,
                    selectedType === type.id && styles.typeLabelSelected,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Título */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Título *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Contenedor lleno en Parque Central"
            value={title}
            onChangeText={setTitle}
            maxLength={200}
          />
          <Text style={styles.charCount}>{title.length}/200</Text>
        </View>

        {/* Descripción */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descripción *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe el problema con el mayor detalle posible..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={6}
            maxLength={1000}
          />
          <Text style={styles.charCount}>{description.length}/1000</Text>
        </View>

        {/* Fotos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fotos (Opcional)</Text>
          <Text style={styles.sectionSubtitle}>Hasta 5 fotos</Text>
          
          <View style={styles.imagesContainer}>
            {images.map((uri, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri }} style={styles.imagePreview} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => removeImage(index)}
                >
                  <MaterialCommunityIcons name="close-circle" size={24} color={COLORS.error} />
                </TouchableOpacity>
              </View>
            ))}
            
            {images.length < 5 && (
              <View style={styles.imageButtonsContainer}>
                <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
                  <MaterialCommunityIcons name="camera" size={32} color={COLORS.primary} />
                  <Text style={styles.imageButtonText}>Cámara</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.imageButton} onPress={pickImageFromGallery}>
                  <MaterialCommunityIcons name="image-multiple" size={32} color={COLORS.primary} />
                  <Text style={styles.imageButtonText}>Galería</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Dirección */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dirección (Opcional)</Text>
          <View style={styles.addressContainer}>
            <MaterialCommunityIcons
              name="map-marker"
              size={24}
              color={COLORS.primary}
              style={styles.addressIcon}
            />
            <TextInput
              style={[styles.input, styles.addressInput]}
              placeholder="Ej: Av. 5 de Junio y Calle Quito"
              value={address}
              onChangeText={setAddress}
            />
          </View>
          <Text style={styles.locationNote}>
            Se utilizará tu ubicación actual: {'\n'}
            Lat: {currentLocation?.latitude.toFixed(6)}, Lon:{' '}
            {currentLocation?.longitude.toFixed(6)}
          </Text>
        </View>

        {/* Severidad */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nivel de Severidad *</Text>
          <View style={styles.severityContainer}>
            {severityLevels.map((level) => (
              <TouchableOpacity
                key={level.id}
                style={[
                  styles.severityButton,
                  severity === level.id && {
                    backgroundColor: level.color,
                    borderColor: level.color,
                  },
                ]}
                onPress={() => setSeverity(level.id)}
              >
                <Text
                  style={[
                    styles.severityLabel,
                    severity === level.id && styles.severityLabelSelected,
                  ]}
                >
                  {level.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Botón de Enviar */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <MaterialCommunityIcons name="send" size={24} color="white" />
              <Text style={styles.submitButtonText}>Enviar Reporte</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Información de Puntos */}
        <View style={styles.pointsInfo}>
          <MaterialCommunityIcons name="star" size={24} color={COLORS.warning} />
          <Text style={styles.pointsInfoText}>
            Ganarás 10 puntos al enviar este reporte
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 10,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 5,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  typeCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: COLORS.background,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  typeCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(46, 125, 50, 0.05)',
  },
  typeLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  typeLabelSelected: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'right',
    marginTop: 5,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressIcon: {
    position: 'absolute',
    left: 15,
    zIndex: 1,
  },
  addressInput: {
    flex: 1,
    paddingLeft: 50,
  },
  locationNote: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 8,
    fontStyle: 'italic',
  },
  imagesContainer: {
    gap: 10,
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  imageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 10,
  },
  imageButton: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageButtonText: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  severityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  severityButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: 'white',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  severityLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  severityLabelSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  pointsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    padding: 15,
    backgroundColor: 'rgba(255, 167, 38, 0.1)',
    borderRadius: 10,
  },
  pointsInfoText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 10,
    fontWeight: '500',
  },
});
