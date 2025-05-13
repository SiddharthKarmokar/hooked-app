import React from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  StyleSheet, 
  StatusBar,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../styles/theme';
import { 
  SearchBar, 
  XpCounter, 
  DailyButton, 
  Card 
} from '../components/StyledComponents';
import PlaceholderImage from '../assets/images/placeholder';

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.cream} barStyle="dark-content" />
      
      <Text style={styles.screenTitle}>Home Screen</Text>
      
      <SearchBar placeholder="Search" />
      
      <View style={styles.statsRow}>
        <XpCounter count={115} />
        <DailyButton onPress={() => console.log('Daily pressed')} />
      </View>
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Card
          image={<PlaceholderImage />}
          title="The Eagle has landed."
          description="An example of 'We're wige lan eve-when reaching a diffican goal—a mul-thesk friant goal, an example As, caur!'"
          source="U.S. Public sto-9r, I4-958"
        />
        
        <Card
          image={<PlaceholderImage />}
          title="The brain creates shortcuts"
          description="How our brains process information by creating mental shortcuts and what this means for learning new concepts"
          source="Cognitive Science, 2023"
        />
        
        <Card
          image={<PlaceholderImage />}
          title="Meme theory in practice"
          description="Understanding how information spreads through culture using memes as a framework"
          source="Internet Culture Review, 2024"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
    padding: spacing.l,
  },
  screenTitle: {
    fontSize: typography.sizes.large,
    fontFamily: typography.fonts.bold,
    fontWeight: typography.weights.bold,
    color: colors.navy,
    marginBottom: spacing.m,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: spacing.l,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  cardImage: {
    width: '100%', 
    height: '100%',
  },
});

export default HomeScreen;
