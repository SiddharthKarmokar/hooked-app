import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../styles/theme';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type InterestType = string;

const OnboardingScreen = () => {
  const navigation = useNavigation<any>();
  const [selectedInterests, setSelectedInterests] = useState<InterestType[]>([]);
  
  const toggleInterest = (interest: InterestType) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(item => item !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Select your{'\n'}interests</Text>
          <Text style={styles.headerSubtitle}>Learning through real-world* hooks</Text>
        </View>
        
        <View style={styles.interestsContainer}>
          {/* First row */}
          <TouchableOpacity 
            style={[styles.interestButton, styles.blueButton, styles.mediumButton, 
                    selectedInterests.includes('Science') && styles.selectedButton]}
            onPress={() => toggleInterest('Science')}
          >
            <Text style={styles.buttonText}>Science</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.interestButton, styles.orangeButton, styles.mediumButton,
                    selectedInterests.includes('History') && styles.selectedButton]}
            onPress={() => toggleInterest('History')}
          >
            <Text style={styles.buttonText}>History</Text>
          </TouchableOpacity>
          
          {/* Second row */}
          <TouchableOpacity 
            style={[styles.interestButton, styles.orangeButton, styles.mediumButton,
                    selectedInterests.includes('Memes') && styles.selectedButton]}
            onPress={() => toggleInterest('Memes')}
          >
            <Text style={styles.buttonText}>Memes</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.interestButton, styles.blueButton, styles.mediumButton,
                    selectedInterests.includes('Technology') && styles.selectedButton]}
            onPress={() => toggleInterest('Technology')}
          >
            <Text style={styles.buttonText}>Technology</Text>
          </TouchableOpacity>
          
          {/* Third row */}
          <TouchableOpacity 
            style={[styles.interestButton, styles.blueButton, styles.smallButton,
                    selectedInterests.includes('Art') && styles.selectedButton]}
            onPress={() => toggleInterest('Art')}
          >
            <Text style={styles.buttonText}>Art</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.interestButton, styles.orangeButton, styles.largeButton,
                    selectedInterests.includes('Music') && styles.selectedButton]}
            onPress={() => toggleInterest('Music')}
          >
            <Text style={styles.buttonText}>Music</Text>
          </TouchableOpacity>
          
          {/* Fourth row */}
          <TouchableOpacity 
            style={[styles.interestButton, styles.orangeButton, styles.mediumButton,
                    selectedInterests.includes('Sports') && styles.selectedButton]}
            onPress={() => toggleInterest('Sports')}
          >
            <Text style={styles.buttonText}>Sports</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.interestButton, styles.blueButton, styles.mediumButton,
                    selectedInterests.includes('Movies') && styles.selectedButton]}
            onPress={() => toggleInterest('Movies')}
          >
            <Text style={styles.buttonText}>Movies</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F8F6',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  headerContainer: {
    marginBottom: 40,
  },
  headerTitle: {
    fontSize: 40,
    fontWeight: '800',
    color: '#111E4A',
    marginBottom: 12,
    lineHeight: 48,
  },
  headerSubtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#666666',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  interestButton: {
    borderRadius: 30,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  blueButton: {
    backgroundColor: colors.blue,
  },
  orangeButton: {
    backgroundColor: colors.orange,
  },
  smallButton: {
    width: '30%', // Art button is smaller
  },
  mediumButton: {
    width: '47%', // Standard size buttons
  },
  largeButton: {
    width: '65%', // Wider Music button
  },
  selectedButton: {
    opacity: 0.8,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: colors.blue,
    borderRadius: 30,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 40,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 22,
    fontWeight: '600',
  }
});

export default OnboardingScreen;