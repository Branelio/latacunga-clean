import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../LoginScreen';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../redux/slices/authSlice';

// Mock navigation
const mockNavigate = jest.fn();
const navigation = {
  navigate: mockNavigate,
  goBack: jest.fn(),
};

// Create a test store
const createTestStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
  });
};

describe('LoginScreen', () => {
  let store;

  beforeEach(() => {
    store = createTestStore();
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <LoginScreen navigation={navigation} />
      </Provider>
    );

    expect(getByPlaceholderText('Correo electrónico')).toBeTruthy();
    expect(getByPlaceholderText('Contraseña')).toBeTruthy();
    expect(getByText('Iniciar Sesión')).toBeTruthy();
  });

  it('shows error when fields are empty', async () => {
    const { getByText, findByText } = render(
      <Provider store={store}>
        <LoginScreen navigation={navigation} />
      </Provider>
    );

    const loginButton = getByText('Iniciar Sesión');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(findByText('Por favor completa todos los campos')).toBeTruthy();
    });
  });

  it('updates email field on change', () => {
    const { getByPlaceholderText } = render(
      <Provider store={store}>
        <LoginScreen navigation={navigation} />
      </Provider>
    );

    const emailInput = getByPlaceholderText('Correo electrónico');
    fireEvent.changeText(emailInput, 'test@example.com');

    expect(emailInput.props.value).toBe('test@example.com');
  });

  it('navigates to register screen', () => {
    const { getByText } = render(
      <Provider store={store}>
        <LoginScreen navigation={navigation} />
      </Provider>
    );

    const registerLink = getByText('Regístrate');
    fireEvent.press(registerLink);

    expect(mockNavigate).toHaveBeenCalledWith('Register');
  });
});
