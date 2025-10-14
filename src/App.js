import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '@rneui/themed';
import store from './redux/store';
import { COLORS } from './config/constants';
import { ErrorBoundary } from './components';

// Screens
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import MainTabNavigator from './navigation/MainTabNavigator';

const Stack = createStackNavigator();

const theme = {
  lightColors: {
    primary: COLORS.primary,
    secondary: COLORS.secondary,
    background: COLORS.background,
    white: COLORS.white,
    success: COLORS.success,
    error: COLORS.error,
    warning: COLORS.warning,
  },
};

export default function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <NavigationContainer>
            <StatusBar style="auto" />
            <Stack.Navigator
              initialRouteName="Splash"
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen name="Splash" component={SplashScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
              <Stack.Screen name="Main" component={MainTabNavigator} />
            </Stack.Navigator>
          </NavigationContainer>
        </ThemeProvider>
      </Provider>
    </ErrorBoundary>
  );
}
