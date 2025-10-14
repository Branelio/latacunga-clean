import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserReports } from '../redux/slices/reportsSlice';
import { COLORS, REPORT_TYPES } from '../config/constants';

export default function ReportsListScreen({ navigation }) {
  const dispatch = useDispatch();
  const { userReports, loading } = useSelector((state) => state.reports);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      await dispatch(fetchUserReports()).unwrap();
    } catch (error) {
      console.error('Error al cargar reportes:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReports();
    setRefreshing(false);
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      pendiente: {
        label: 'Pendiente',
        color: COLORS.warning,
        icon: 'clock-outline',
      },
      en_revision: {
        label: 'En Revisión',
        color: COLORS.info,
        icon: 'eye-outline',
      },
      en_proceso: {
        label: 'En Proceso',
        color: COLORS.secondary,
        icon: 'progress-check',
      },
      resuelto: {
        label: 'Resuelto',
        color: COLORS.success,
        icon: 'check-circle',
      },
      rechazado: {
        label: 'Rechazado',
        color: COLORS.error,
        icon: 'close-circle',
      },
    };
    return statusMap[status] || statusMap.pendiente;
  };

  const getTypeIcon = (type) => {
    const reportType = REPORT_TYPES.find((t) => t.id === type);
    return reportType?.icon || 'alert-circle';
  };

  const getSeverityColor = (severity) => {
    const severityMap = {
      baja: COLORS.info,
      media: COLORS.warning,
      alta: COLORS.accent,
      critica: COLORS.error,
    };
    return severityMap[severity] || COLORS.warning;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;

    return date.toLocaleDateString('es-EC', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const filteredReports = userReports.filter((report) => {
    if (filter === 'all') return true;
    return report.status === filter;
  });

  const renderReportCard = ({ item }) => {
    const statusInfo = getStatusInfo(item.status);

    return (
      <TouchableOpacity
        style={styles.reportCard}
        onPress={() =>
          navigation.navigate('ReportDetail', { reportId: item._id })
        }
      >
        {/* Header */}
        <View style={styles.reportHeader}>
          <View style={styles.reportTypeContainer}>
            <View
              style={[
                styles.reportIcon,
                { backgroundColor: getSeverityColor(item.severity) },
              ]}
            >
              <MaterialCommunityIcons
                name={getTypeIcon(item.type)}
                size={24}
                color="white"
              />
            </View>
            <View style={styles.reportInfo}>
              <Text style={styles.reportTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.reportDate}>{formatDate(item.createdAt)}</Text>
            </View>
          </View>

          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusInfo.color + '20' },
            ]}
          >
            <MaterialCommunityIcons
              name={statusInfo.icon}
              size={16}
              color={statusInfo.color}
            />
            <Text style={[styles.statusText, { color: statusInfo.color }]}>
              {statusInfo.label}
            </Text>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.reportDescription} numberOfLines={2}>
          {item.description}
        </Text>

        {/* Footer */}
        <View style={styles.reportFooter}>
          <View style={styles.reportMetadata}>
            <View style={styles.metadataItem}>
              <MaterialCommunityIcons
                name="map-marker"
                size={16}
                color={COLORS.textSecondary}
              />
              <Text style={styles.metadataText}>
                {item.location.address || 'Ubicación GPS'}
              </Text>
            </View>
          </View>

          <View style={styles.reportActions}>
            <View style={styles.actionItem}>
              <MaterialCommunityIcons
                name="thumb-up"
                size={16}
                color={COLORS.textSecondary}
              />
              <Text style={styles.actionText}>{item.likesCount || 0}</Text>
            </View>
            <View style={styles.actionItem}>
              <MaterialCommunityIcons
                name="comment"
                size={16}
                color={COLORS.textSecondary}
              />
              <Text style={styles.actionText}>{item.commentsCount || 0}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const FilterButton = ({ status, label }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filter === status && styles.filterButtonActive,
      ]}
      onPress={() => setFilter(status)}
    >
      <Text
        style={[
          styles.filterButtonText,
          filter === status && styles.filterButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons
        name="clipboard-text-off"
        size={80}
        color={COLORS.textSecondary}
      />
      <Text style={styles.emptyStateTitle}>No hay reportes</Text>
      <Text style={styles.emptyStateText}>
        {filter === 'all'
          ? 'Aún no has creado ningún reporte'
          : 'No tienes reportes con este estado'}
      </Text>
      <TouchableOpacity
        style={styles.createReportButton}
        onPress={() => navigation.navigate('Report')}
      >
        <MaterialCommunityIcons name="plus" size={24} color="white" />
        <Text style={styles.createReportButtonText}>Crear Reporte</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && userReports.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando reportes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Filtros */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        <FilterButton status="all" label="Todos" />
        <FilterButton status="pendiente" label="Pendientes" />
        <FilterButton status="en_revision" label="En Revisión" />
        <FilterButton status="en_proceso" label="En Proceso" />
        <FilterButton status="resuelto" label="Resueltos" />
      </ScrollView>

      {/* Lista de Reportes */}
      <FlatList
        data={filteredReports}
        renderItem={renderReportCard}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
          />
        }
        ListEmptyComponent={EmptyState}
      />

      {/* Botón Flotante para Crear Reporte */}
      {userReports.length > 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('Report')}
        >
          <MaterialCommunityIcons name="plus" size={28} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const { ScrollView } = require('react-native');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  filterContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  filterContent: {
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    marginRight: 10,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
  },
  filterButtonText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  listContent: {
    padding: 15,
  },
  reportCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reportTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  reportIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reportInfo: {
    marginLeft: 12,
    flex: 1,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  reportDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  reportDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  reportFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.background,
  },
  reportMetadata: {
    flex: 1,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metadataText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 6,
  },
  reportActions: {
    flexDirection: 'row',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  actionText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 20,
  },
  emptyStateText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 40,
  },
  createReportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
  },
  createReportButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
