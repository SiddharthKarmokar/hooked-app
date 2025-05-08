/**
 * HookED App
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { colors } from './src/styles/theme';

const App = () => {
  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor={colors.background} barStyle="light-content" />
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
