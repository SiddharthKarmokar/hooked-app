import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator, 
  TouchableOpacity, 
  SafeAreaView, 
  Animated 
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius, shadows } from '../styles/theme';
import { fetchHookById, Hook } from '../services/api';
import { RootStackParamList } from '../navigation/AppNavigator';
import { BlueButton, OrangeButton } from '../components/StyledComponents';
import PlaceholderImage from '../assets/images/placeholder';

type ExpandableSectionProps = {
  title: string;
  content: string;
};

const ExpandableSection = ({ title, content }: ExpandableSectionProps) => {
  const [expanded, setExpanded] = useState(false);
  const animation = useState(new Animated.Value(0))[0];

  const toggleExpanded = () => {
    Animated.timing(animation, {
      toValue: expanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setExpanded(!expanded);
  };

  const rotateArrow = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.expandableSection}>
      <TouchableOpacity 
        style={styles.expandableHeader} 
        onPress={toggleExpanded}
        activeOpacity={0.7}
      >
        <Text style={styles.expandableTitle}>{title}</Text>
        <Animated.Text style={[styles.expandArrow, { transform: [{ rotate: rotateArrow }] }]}>
          ▼
        </Animated.Text>
      </TouchableOpacity>
      
      {expanded && (
        <View style={styles.expandableContent}>
          <Text style={styles.expandableContentText}>{content}</Text>
        </View>
      )}
    </View>
  );
};

type HookDetailScreenRouteProp = RouteProp<RootStackParamList, 'HookDetail'>;

const HookDetailScreen = () => {
  const route = useRoute<HookDetailScreenRouteProp>();
  const navigation = useNavigation();
  const [hook, setHook] = useState<Hook | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { hookId } = route.params;

  useEffect(() => {
    const loadHook = async () => {
      try {
        setLoading(true);
        const hookData = await fetchHookById(hookId);
        setHook(hookData);
        setError(null);
      } catch (err) {
        setError('Failed to load hook details. Please try again later.');
        console.error('Error loading hook details:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHook();
  }, [hookId]);

  const getCategoryColor = (category?: string): string => {
    if (!category) return colors.primary;
    
    switch (category) {
      case 'Science & Technology':
        return colors.scienceTech;
      case 'History & Culture':
        return colors.historyCulture;
      case 'Arts & Creativity':
        return colors.artsCreativity;
      case 'Numbers & Logic':
        return colors.numbersLogic;
      case 'People & Society':
        return colors.peopleSociety;
      case 'Earth & Environment':
        return colors.earthEnvironment;
      default:
        return colors.primary;
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.highlight} />
          <Text style={styles.loadingText}>Loading hook details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !hook) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Hook not found'}</Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={goBack}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={[styles.categoryTag, { backgroundColor: getCategoryColor(hook.category) }]}>
            <Text style={styles.categoryText}>{hook.category}</Text>
          </View>
          
          <Text style={styles.title}>{hook.title}</Text>
        </View>
        
        <View style={styles.content}>
          <Text style={styles.hookContent}>{hook.content}</Text>
          
          {hook.explanation && (
            <View style={styles.explanationSection}>
              <Text style={styles.explanationText}>{hook.explanation}</Text>
            </View>
          )}
          
          <View style={styles.divider} />
          
          <ExpandableSection 
            title="The Science Behind It" 
            content="Sound waves travel through multiple mediums. When you speak, you hear your voice through two paths: air conduction (sound waves traveling through air to your eardrums) and bone conduction (vibrations traveling through your skull directly to your inner ear). Your skull amplifies lower frequencies, making your voice sound deeper to yourself than to others."
          />
          
          <ExpandableSection 
            title="Real-World Connection" 
            content="This phenomenon explains why vocalists often wear one-ear monitors during performances. These allow them to hear both their natural voice (through bone conduction) and the processed audio that the audience hears (through the monitor), helping them match their performance to what the audience will experience."
          />
          
          <View style={styles.factCard}>
            <Text style={styles.factTitle}>Mind-Blowing Fact</Text>
            <Text style={styles.factText}>The voice you hear when you speak is a combination of air-conducted sound and bone-conducted sound, creating a unique version only you can hear.</Text>
          </View>
        </View>
        
        <View style={styles.relatedSection}>
          <Text style={styles.relatedTitle}>Related Topics</Text>
          <View style={styles.tagsContainer}>
            {['acoustic resonance', 'sound waves', 'audio perception'].map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.actionButtons}>
          <BlueButton 
            title="Save Hook" 
            onPress={() => console.log('Save hook pressed')} 
            style={styles.actionButton}
          />
          
          <OrangeButton 
            title="Share" 
            onPress={() => console.log('Share pressed')} 
            style={styles.actionButton}
          />
        </View>
        
        <TouchableOpacity style={styles.nextButton} onPress={() => {}}>
          <Text style={styles.nextButtonText}>Next Hook</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  categoryTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginBottom: spacing.md,
  },
  categoryText: {
    fontSize: typography.sizes.small,
    lineHeight: 18,
    fontWeight: typography.weights.bold,
    color: colors.background,
    fontFamily: typography.fonts.bold,
  },
  title: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: typography.weights.bold,
    color: colors.darkText,
    fontFamily: typography.fonts.bold,
  },
  content: {
    padding: spacing.lg,
    paddingTop: 0,
  },
  hookContent: {
    fontSize: 18,
    lineHeight: 26,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    fontFamily: typography.fonts.regular,
  },
  explanationSection: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  explanationText: {
    fontSize: typography.sizes.regular,
    lineHeight: 22,
    color: colors.darkText,
    fontFamily: typography.fonts.regular,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.lg,
  },
  expandableSection: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  expandableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
  },
  expandableTitle: {
    fontSize: typography.sizes.regular,
    lineHeight: 22,
    fontWeight: typography.weights.medium,
    color: colors.darkText,
    fontFamily: typography.fonts.medium,
  },
  expandArrow: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  expandableContent: {
    padding: spacing.md,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  expandableContentText: {
    fontSize: typography.sizes.regular,
    lineHeight: 22,
    color: colors.textSecondary,
    fontFamily: typography.fonts.regular,
  },
  factCard: {
    backgroundColor: colors.highlight + '20',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.highlight,
  },
  factTitle: {
    fontSize: typography.sizes.regular,
    lineHeight: 22,
    fontWeight: typography.weights.medium,
    color: colors.highlight,
    marginBottom: spacing.xs,
    fontFamily: typography.fonts.medium,
  },
  factText: {
    fontSize: typography.sizes.regular,
    lineHeight: 22,
    color: colors.darkText,
    fontFamily: typography.fonts.regular,
  },
  relatedSection: {
    padding: spacing.lg,
    paddingTop: 0,
  },
  relatedTitle: {
    fontSize: typography.sizes.large,
    lineHeight: 32,
    fontWeight: typography.weights.semiBold,
    color: colors.darkText,
    marginBottom: spacing.md,
    fontFamily: typography.fonts.semiBold,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: colors.inputBackground,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  tagText: {
    fontSize: typography.sizes.small,
    color: colors.textSecondary,
    fontFamily: typography.fonts.regular,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.lg,
    paddingTop: 0,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  nextButton: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.sm,
    margin: spacing.lg,
    marginTop: 0,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: typography.sizes.regular,
    fontWeight: typography.weights.medium,
    color: colors.textSecondary,
    fontFamily: typography.fonts.medium,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: typography.sizes.regular,
    marginTop: spacing.md,
    color: colors.textSecondary,
    fontFamily: typography.fonts.regular,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorText: {
    fontSize: typography.sizes.regular,
    color: colors.highlight,
    textAlign: 'center',
    marginBottom: spacing.md,
    fontFamily: typography.fonts.regular,
  },
  retryButton: {
    backgroundColor: colors.highlight,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  retryButtonText: {
    fontSize: typography.sizes.small,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    fontFamily: typography.fonts.bold,
  },
});

export default HookDetailScreen;
