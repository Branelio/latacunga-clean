import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { COLORS, getUserLevel } from '../config/constants';

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user, points, isAuthenticated } = useSelector((state) => state.auth);

  const userLevel = getUserLevel(points);

  const handleLogout = () => {
    Alert.alert('Cerrar Sesión', '¿Estás seguro de que quieres salir?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Salir',
        style: 'destructive',
        onPress: () => {
          dispatch(logout());
          navigation.replace('Login');
        },
      },
    ]);
  };

  const StatCard = ({ icon, label, value, color }) => (
    <View style={styles.statCard}>
      <View style={[styles.statIconContainer, { backgroundColor: color }]}>
        <MaterialCommunityIcons name={icon} size={28} color="white" />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const MenuItem = ({ icon, title, onPress, color = COLORS.text }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <MaterialCommunityIcons name={icon} size={24} color={color} />
        <Text style={[styles.menuItemText, { color }]}>{title}</Text>
      </View>
      <MaterialCommunityIcons
        name="chevron-right"
        size={24}
        color={COLORS.textSecondary}
      />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header del Perfil */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri:
                user?.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user?.name || 'Usuario'
                )}&background=2E7D32&color=fff&size=200`,
            }}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.editAvatarButton}>
            <MaterialCommunityIcons name="camera" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <Text style={styles.userName}>{user?.name || 'Usuario'}</Text>
        <Text style={styles.userEmail}>{user?.email || ''}</Text>

        {/* Nivel y Badge */}
        <View style={styles.levelContainer}>
          <Text style={styles.levelBadge}>{userLevel.badge}</Text>
          <Text style={styles.levelName}>{userLevel.name}</Text>
        </View>

        {/* Puntos */}
        <View style={styles.pointsContainer}>
          <MaterialCommunityIcons name="star" size={24} color={COLORS.warning} />
          <Text style={styles.pointsText}>{points} puntos</Text>
        </View>

        {/* Barra de Progreso al Siguiente Nivel */}
        {userLevel.maxPoints !== Infinity && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${
                      ((points - userLevel.minPoints) /
                        (userLevel.maxPoints - userLevel.minPoints)) *
                      100
                    }%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {userLevel.maxPoints - points} puntos para el siguiente nivel
            </Text>
          </View>
        )}
      </View>

      {/* Estadísticas */}
      <View style={styles.statsContainer}>
        <StatCard
          icon="clipboard-check"
          label="Reportes"
          value={user?.stats?.totalReports || 0}
          color={COLORS.primary}
        />
        <StatCard
          icon="check-circle"
          label="Verificados"
          value={user?.stats?.verifiedReports || 0}
          color={COLORS.success}
        />
        <StatCard
          icon="recycle"
          label="Reciclados"
          value={user?.stats?.recyclingActions || 0}
          color={COLORS.info}
        />
      </View>

      {/* Menú de Opciones */}
      <View style={styles.menuContainer}>
        <Text style={styles.sectionTitle}>Cuenta</Text>

        <MenuItem
          icon="account-edit"
          title="Editar Perfil"
          onPress={() => Alert.alert('Editar Perfil', 'Funcionalidad próximamente')}
        />
        <MenuItem
          icon="lock-reset"
          title="Cambiar Contraseña"
          onPress={() => Alert.alert('Cambiar Contraseña', 'Funcionalidad próximamente')}
        />
        <MenuItem
          icon="trophy"
          title="Mis Logros"
          onPress={() => Alert.alert('Logros', 'Funcionalidad próximamente')}
        />

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Configuración</Text>

        <MenuItem
          icon="bell"
          title="Notificaciones"
          onPress={() => Alert.alert('Notificaciones', 'Funcionalidad próximamente')}
        />
        <MenuItem
          icon="shield-check"
          title="Privacidad"
          onPress={() => Alert.alert('Privacidad', 'Funcionalidad próximamente')}
        />
        <MenuItem
          icon="help-circle"
          title="Ayuda y Soporte"
          onPress={() => Alert.alert('Ayuda', 'Funcionalidad próximamente')}
        />
        <MenuItem
          icon="information"
          title="Acerca de"
          onPress={() =>
            Alert.alert(
              'Latacunga Clean',
              'Versión 1.0.0\n\nAplicación para la gestión de residuos sólidos en Latacunga.\n\nDesarrollado con ❤️ para una ciudad más limpia.'
            )
          }
        />

        <View style={styles.divider} />

        <MenuItem
          icon="logout"
          title="Cerrar Sesión"
          onPress={handleLogout}
          color={COLORS.error}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Versión 1.0.0</Text>
        <Text style={styles.footerText}>© 2024 Latacunga Clean</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'white',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.secondary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 15,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  levelBadge: {
    fontSize: 24,
    marginRight: 8,
  },
  levelName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 10,
  },
  pointsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 5,
  },
  progressContainer: {
    width: '80%',
    marginTop: 15,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.warning,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: 'white',
    textAlign: 'center',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  menuContainer: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginBottom: 20,
    borderRadius: 15,
    padding: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 15,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.background,
    marginVertical: 10,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginVertical: 2,
  },
});
