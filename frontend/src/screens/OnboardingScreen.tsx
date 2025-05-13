import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../styles/theme';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type InterestType = {
  id: number;
  name: string;
  color: string;
};

const interests: InterestType[] = [
  { id: 1, name: 'Science', color: colors.blue },
  { id: 2, name: 'History', color: colors.orange },
  { id: 3, name: 'Memes', color: colors.orange },
  { id: 4, name: 'Technology', color: colors.blue },
  { id: 5, name: 'Art', color: colors.blue },
  { id: 6, name: 'Music', color: colors.orange },
  { id: 7, name: 'Movies', color: colors.orange },
  { id: 8, name: 'Books', color: colors.blue },
];

const OnboardingScreen = () => {
  const navigation = useNavigation<any>();
  const [selectedInterests, setSelectedInterests] = useState<number[]>([]);

  const toggleInterest = (id: number) => {
    if (selectedInterests.includes(id)) {
      setSelectedInterests(selectedInterests.filter(item => item !== id));
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  const handleContinue = async () => {
    try {
      // Save selected interests for personalization
      if (selectedInterests.length > 0) {
        await AsyncStorage.setItem('@selected_interests', JSON.stringify(selectedInterests));
      }
      
      // Mark onboarding as completed
      await AsyncStorage.setItem('@onboarding_completed', 'true');
      
      // Navigate to main app
      navigation.navigate('MainTabs');
    } catch (error) {
      console.error('Error saving preferences:', error);
      // Still navigate even if saving fails
      navigation.navigate('MainTabs');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Select your interests</Text>
        <Text style={styles.subtitle}>Learning through real-world* hooks</Text>
        
        <View style={styles.interestsContainer}>
          {interests.map(interest => (
            <TouchableOpacity
              key={interest.id}
              style={[
                styles.interestButton,
                { backgroundColor: interest.color },
                selectedInterests.includes(interest.id) && styles.selectedInterest
              ]}
              onPress={() => toggleInterest(interest.id)}
            >
              <Text style={styles.interestText}>{interest.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  content: {
    flex: 1,
    padding: spacing.l,
  },
  title: {
    fontSize: typography.sizes.extraLarge,
    fontFamily: typography.fonts.bold,
    fontWeight: typography.weights.bold,
    color: colors.darkText,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.sizes.regular,
    fontFamily: typography.fonts.regular,
    color: colors.darkText,
    marginBottom: spacing.l,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  interestButton: {
    width: '48%',
    borderRadius: borderRadius.buttonRadius,
    paddingVertical: spacing.m,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.m,
  },
  selectedInterest: {
    opacity: 0.8,
  },
  interestText: {
    color: colors.whiteText,
    fontFamily: typography.fonts.semiBold,
    fontWeight: typography.weights.semiBold,
    fontSize: typography.sizes.regular,
  },
  continueButton: {
    backgroundColor: colors.blue,
    borderRadius: borderRadius.buttonRadius,
    paddingVertical: spacing.m,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
  },
  continueText: {
    color: colors.whiteText,
    fontFamily: typography.fonts.semiBold,
    fontWeight: typography.weights.semiBold,
    fontSize: typography.sizes.regular,
  },
});

export default OnboardingScreen;