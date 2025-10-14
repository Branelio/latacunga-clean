import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, WASTE_TYPES } from '../config/constants';

export default function EducationScreen() {
  const EducationCard = ({ icon, title, description, color, onPress }) => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={[styles.cardIcon, { backgroundColor: color }]}>
        <MaterialCommunityIcons name={icon} size={40} color="white" />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
      </View>
      <MaterialCommunityIcons
        name="chevron-right"
        size={24}
        color={COLORS.textSecondary}
      />
    </TouchableOpacity>
  );

  const WasteTypeCard = ({ type }) => (
    <View style={styles.wasteCard}>
      <View style={[styles.wasteIcon, { backgroundColor: type.color }]}>
        <MaterialCommunityIcons name={type.icon} size={32} color="white" />
      </View>
      <View style={styles.wasteInfo}>
        <Text style={styles.wasteLabel}>{type.label}</Text>
        <Text style={styles.wasteDescription}>
          {getWasteDescription(type.id)}
        </Text>
      </View>
    </View>
  );

  const getWasteDescription = (type) => {
    const descriptions = {
      organico: 'Restos de comida, cáscaras, plantas',
      plastico: 'Botellas, envases, bolsas de plástico',
      papel: 'Periódicos, cajas, documentos',
      vidrio: 'Botellas, frascos, cristalería',
      metal: 'Latas, cables, utensilios metálicos',
      electronico: 'Celulares, computadoras, electrodomésticos',
      peligroso: 'Pilas, baterías, químicos, medicamentos',
    };
    return descriptions[type] || '';
  };

  const TipCard = ({ tip, index }) => (
    <View style={styles.tipCard}>
      <View style={styles.tipNumber}>
        <Text style={styles.tipNumberText}>{index + 1}</Text>
      </View>
      <Text style={styles.tipText}>{tip}</Text>
    </View>
  );

  const tips = [
    'Separa los residuos desde la fuente en tu hogar',
    'Lava y seca los envases antes de reciclar',
    'Reduce el uso de plásticos de un solo uso',
    'Reutiliza bolsas y contenedores cuando sea posible',
    'Composta los residuos orgánicos en tu jardín',
    'Dona ropa y objetos que ya no uses',
    'Evita imprimir documentos innecesarios',
    'Lleva tus propias bolsas al hacer compras',
    'Usa botellas reutilizables en lugar de desechables',
    'Reporta puntos de acumulación de basura',
  ];

  const openURL = (url) => {
    Linking.openURL(url).catch((err) =>
      console.error('Error al abrir URL:', err)
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.hero}>
        <MaterialCommunityIcons name="school" size={60} color={COLORS.primary} />
        <Text style={styles.heroTitle}>Educación Ambiental</Text>
        <Text style={styles.heroSubtitle}>
          Aprende cómo contribuir a una Latacunga más limpia y sostenible
        </Text>
      </View>

      {/* Secciones Principales */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Aprende Más</Text>

        <EducationCard
          icon="recycle"
          title="¿Cómo Reciclar?"
          description="Guía completa sobre separación de residuos"
          color={COLORS.success}
          onPress={() => {}}
        />

        <EducationCard
          icon="leaf"
          title="Compostaje en Casa"
          description="Convierte residuos orgánicos en abono"
          color={COLORS.secondary}
          onPress={() => {}}
        />

        <EducationCard
          icon="earth"
          title="Impacto Ambiental"
          description="Conoce el efecto de los residuos"
          color={COLORS.info}
          onPress={() => {}}
        />

        <EducationCard
          icon="lightbulb-on"
          title="Reducir y Reutilizar"
          description="Consejos para generar menos basura"
          color={COLORS.warning}
          onPress={() => {}}
        />
      </View>

      {/* Tipos de Residuos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tipos de Residuos</Text>
        <Text style={styles.sectionDescription}>
          Conoce qué residuos son reciclables y cómo clasificarlos
        </Text>

        {WASTE_TYPES.map((type) => (
          <WasteTypeCard key={type.id} type={type} />
        ))}
      </View>

      {/* Consejos Prácticos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>10 Consejos Prácticos</Text>
        <Text style={styles.sectionDescription}>
          Acciones simples para reducir tu huella ambiental
        </Text>

        {tips.map((tip, index) => (
          <TipCard key={index} tip={tip} index={index} />
        ))}
      </View>

      {/* Estadísticas de Impacto */}
      <View style={styles.impactSection}>
        <Text style={styles.impactTitle}>Impacto del Reciclaje</Text>

        <View style={styles.impactGrid}>
          <View style={styles.impactCard}>
            <MaterialCommunityIcons name="tree" size={40} color={COLORS.success} />
            <Text style={styles.impactValue}>17</Text>
            <Text style={styles.impactLabel}>árboles salvados por tonelada de papel reciclado</Text>
          </View>

          <View style={styles.impactCard}>
            <MaterialCommunityIcons name="water" size={40} color={COLORS.info} />
            <Text style={styles.impactValue}>95%</Text>
            <Text style={styles.impactLabel}>menos energía al reciclar aluminio</Text>
          </View>

          <View style={styles.impactCard}>
            <MaterialCommunityIcons name="bottle-soda" size={40} color={COLORS.warning} />
            <Text style={styles.impactValue}>450</Text>
            <Text style={styles.impactLabel}>años tarda el plástico en degradarse</Text>
          </View>

          <View style={styles.impactCard}>
            <MaterialCommunityIcons name="delete" size={40} color={COLORS.error} />
            <Text style={styles.impactValue}>1M+</Text>
            <Text style={styles.impactLabel}>toneladas de basura en Ecuador al año</Text>
          </View>
        </View>
      </View>

      {/* Enlaces Útiles */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Enlaces Útiles</Text>

        <TouchableOpacity
          style={styles.linkCard}
          onPress={() =>
            openURL('https://www.ambiente.gob.ec/')
          }
        >
          <MaterialCommunityIcons name="web" size={24} color={COLORS.primary} />
          <Text style={styles.linkText}>Ministerio del Ambiente Ecuador</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkCard}
          onPress={() => openURL('https://www.latacunga.gob.ec/')}
        >
          <MaterialCommunityIcons name="city" size={24} color={COLORS.primary} />
          <Text style={styles.linkText}>GAD Municipal de Latacunga</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          💚 Juntos por una Latacunga más limpia y sostenible
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  hero: {
    backgroundColor: 'white',
    padding: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 15,
  },
  heroSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
  },
  section: {
    paddingHorizontal: 15,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 15,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
    marginLeft: 15,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  wasteCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  wasteIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wasteInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  wasteLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  wasteDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tipNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  tipNumberText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  impactSection: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 20,
  },
  impactTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  impactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  impactCard: {
    width: '48%',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  impactValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginVertical: 8,
  },
  impactLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  linkText: {
    fontSize: 15,
    color: COLORS.text,
    marginLeft: 15,
    fontWeight: '500',
  },
  footer: {
    padding: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: COLORS.primary,
    textAlign: 'center',
    fontWeight: '600',
  },
});
