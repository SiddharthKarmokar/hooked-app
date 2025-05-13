import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../styles/theme';

const SplashScreen = () => {
  const navigation = useNavigation<any>();
  
  useEffect(() => {
    // Auto-navigate after timeout - set to exactly 3 seconds
    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Onboarding' }],
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.cream} barStyle="dark-content" />
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoIcon}>9</Text>
          <Text style={styles.logoText}>HookeD</Text>
        </View>
        
        <View style={styles.taglineContainer}>
          <Text style={styles.tagline}>If it slaps, it teaches.</Text>
          <Text style={styles.tagline}>And that's Hooked.</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoIcon: {
    color: colors.orange,
    fontSize: 70,
    fontFamily: 'System',
    fontWeight: 'bold',
    marginRight: 8,
    transform: [{ rotate: '-10deg' }],
  },
  logoText: {
    color: colors.navy,
    fontSize: 58,
    fontFamily: 'System',
    fontWeight: 'bold',
    letterSpacing: -1,
  },
  taglineContainer: {
    alignItems: 'center',
  },
  tagline: {
    color: colors.navy,
    fontSize: 24,
    fontFamily: 'System',
    fontWeight: '600',
    lineHeight: 34,
    textAlign: 'center',
  }
});

export default SplashScreen;
