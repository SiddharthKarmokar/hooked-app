import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../styles/theme';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type CategoryType = {
  id: string;
  name: string;
  color: string;
};

const categories: CategoryType[] = [
  { id: 'science', name: 'Science & Tech', color: colors.scienceTech },
  { id: 'arts', name: 'Arts & Creativity', color: colors.artsCreativity },
  { id: 'people', name: 'People & Society', color: colors.peopleSociety },
  { id: 'numbers', name: 'Numbers & Logic', color: colors.numbersLogic },
  { id: 'history', name: 'History & Culture', color: colors.historyCulture },
  { id: 'earth', name: 'Earth & Environment', color: colors.earthEnvironment },
];

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleCategory = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      if (selectedCategories.length < 3) {
        setSelectedCategories([...selectedCategories, categoryId]);
      }
    }
  };

  const handleGetStarted = async () => {
    try {
      // Save selected categories for personalization
      if (selectedCategories.length > 0) {
        await AsyncStorage.setItem('@selected_categories', JSON.stringify(selectedCategories));
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

  const handleSkip = async () => {
    try {
      // Mark onboarding as completed even when skipped
      await AsyncStorage.setItem('@onboarding_completed', 'true');
    } catch (error) {
      console.error('Error marking onboarding as complete:', error);
    }
    navigation.navigate('MainTabs');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>What makes you curious?</Text>
          <Text style={styles.subtitle}>Pick up to 3 areas that blow your mind</Text>
        </View>
        
        <View style={styles.categoriesGrid}>
          {categories.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryTile,
                { backgroundColor: category.color + '20' }, // Adding transparency
                selectedCategories.includes(category.id) && styles.selectedTile
              ]}
              onPress={() => toggleCategory(category.id)}
              activeOpacity={0.8}
            >
              <View 
                style={[
                  styles.checkmark, 
                  selectedCategories.includes(category.id) && styles.checkmarkVisible
                ]}
              >
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[
            styles.getStartedButton,
            selectedCategories.length === 0 && styles.disabledButton
          ]}
          onPress={handleGetStarted}
          disabled={selectedCategories.length === 0}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginTop: spacing.xl * 1.5,
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.headline,
    fontSize: 28,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  categoryTile: {
    width: '48%',
    aspectRatio: 1.5,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    padding: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedTile: {
    borderColor: colors.highlight,
    shadowColor: colors.highlight,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  categoryName: {
    ...typography.bodyMedium,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  checkmark: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
  },
  checkmarkVisible: {
    opacity: 1,
  },
  checkmarkText: {
    color: colors.textPrimary,
    fontWeight: 'bold',
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    alignItems: 'center',
  },
  getStartedButton: {
    backgroundColor: colors.highlight,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    width: '100%',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  disabledButton: {
    backgroundColor: colors.textTertiary,
    opacity: 0.5,
  },
  buttonText: {
    ...typography.bodyMedium,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  skipText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
});

export default OnboardingScreen;