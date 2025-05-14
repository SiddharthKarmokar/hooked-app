import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import screens
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import HomeScreen from '../screens/HomeScreen';
import HookFeedScreen from '../screens/HookFeedScreen';
import HookDetailScreen from '../screens/HookDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Import theme
import { colors, typography, spacing } from '../styles/theme';

// Define navigation types
export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  MainTabs: undefined;
  Home: undefined;
  HookDetail: { hookId: string };
};

export type MainTabParamList = {
  Home: undefined;
  Feed: undefined;
  Profile: undefined;
};

// Create navigators
const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Main tab navigator
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.highlight,
        tabBarInactiveTintColor: colors.textSecondary,
        headerShown: false,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <View style={[styles.tabIcon, { backgroundColor: color }]}>
              <Text style={styles.tabIconText}>🏠</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen 
        name="Feed" 
        component={HookFeedScreen} 
        options={{
          tabBarLabel: 'Discover',
          tabBarIcon: ({ color }) => (
            <View style={[styles.tabIcon, { backgroundColor: color }]}>
              <Text style={styles.tabIconText}>✨</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <View style={[styles.tabIcon, { backgroundColor: color }]}>
              <Text style={styles.tabIconText}>👤</Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Root navigator
const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    // Check if user has completed onboarding
    const checkOnboardingStatus = async () => {
      try {
        const value = await AsyncStorage.getItem('@onboarding_completed');
        setHasCompletedOnboarding(value === 'true');
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Small delay to ensure we show splash screen for a bit
    const timer = setTimeout(checkOnboardingStatus, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen 
        name="HookDetail" 
        component={HookDetailScreen}
        options={{
          headerShown: true,
          headerTitle: '',
          headerTintColor: colors.textPrimary,
          headerTransparent: true,
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.cardBackground,
    borderTopWidth: 0,
    elevation: 0,
    height: 60,
    paddingBottom: 8,
  },
  tabBarLabel: {
    fontFamily: 'System',
    fontSize: 12,
    marginBottom: 4,
  },
  tabIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  tabIconText: {
    fontSize: 16,
  },
});

export default AppNavigator;