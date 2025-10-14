import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { COLORS } from '../config/constants';

// Screens
import MapScreen from '../screens/MapScreen';
import CollectionPointDetailScreen from '../screens/CollectionPointDetailScreen';

const Stack = createStackNavigator();

export default function MapStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="MapMain"
        component={MapScreen}
        options={{
          title: 'Mapa',
          headerShown: false, // El header lo maneja el Tab Navigator
        }}
      />
      <Stack.Screen
        name="CollectionPointDetail"
        component={CollectionPointDetailScreen}
        options={{
          title: 'Detalles del Punto',
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
}
