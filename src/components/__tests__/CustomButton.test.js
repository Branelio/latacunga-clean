import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CustomButton from '../CustomButton';

describe('CustomButton', () => {
  it('renders correctly with title', () => {
    const { getByText } = render(
      <CustomButton title="Click Me" onPress={() => {}} />
    );
    expect(getByText('Click Me')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <CustomButton title="Click Me" onPress={onPressMock} />
    );

    fireEvent.press(getByText('Click Me'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('shows loading spinner when loading', () => {
    const { getByTestId, queryByText } = render(
      <CustomButton title="Click Me" loading={true} onPress={() => {}} />
    );

    expect(queryByText('Click Me')).toBeNull();
  });

  it('is disabled when disabled prop is true', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <CustomButton title="Click Me" disabled={true} onPress={onPressMock} />
    );

    fireEvent.press(getByText('Click Me'));
    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('renders with icon', () => {
    const { getByText } = render(
      <CustomButton 
        title="Click Me" 
        icon="check" 
        onPress={() => {}} 
      />
    );
    expect(getByText('Click Me')).toBeTruthy();
  });

  it('applies correct styles for variant', () => {
    const { getByText } = render(
      <CustomButton 
        title="Click Me" 
        variant="outline" 
        onPress={() => {}} 
      />
    );
    const button = getByText('Click Me').parent;
    expect(button.props.style).toBeTruthy();
  });
});
