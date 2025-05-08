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
          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save Hook</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.shareButton}>
            <Text style={styles.shareButtonText}>Share</Text>
          </TouchableOpacity>
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
    ...typography.caption,
    fontWeight: 'bold',
    color: colors.background,
  },
  title: {
    ...typography.headline,
    fontSize: 28,
    lineHeight: 36,
  },
  content: {
    padding: spacing.lg,
    paddingTop: 0,
  },
  hookContent: {
    ...typography.body,
    fontSize: 18,
    lineHeight: 26,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  explanationSection: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  explanationText: {
    ...typography.body,
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
    ...typography.bodyMedium,
    fontWeight: 'bold',
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
    ...typography.body,
    color: colors.textSecondary,
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
    ...typography.bodyMedium,
    fontWeight: 'bold',
    color: colors.highlight,
    marginBottom: spacing.xs,
  },
  factText: {
    ...typography.body,
  },
  relatedSection: {
    padding: spacing.lg,
    paddingTop: 0,
  },
  relatedTitle: {
    ...typography.subheadline,
    marginBottom: spacing.md,
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
    ...typography.caption,
    color: colors.textSecondary,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.lg,
    paddingTop: 0,
  },
  saveButton: {
    backgroundColor: colors.highlight,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    flex: 1,
    marginRight: spacing.md,
    alignItems: 'center',
  },
  saveButtonText: {
    ...typography.bodyMedium,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  shareButton: {
    backgroundColor: colors.inputBackground,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    width: '30%',
    alignItems: 'center',
  },
  shareButtonText: {
    ...typography.bodyMedium,
    fontWeight: 'bold',
    color: colors.textSecondary,
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
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.body,
    marginTop: spacing.md,
    color: colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorText: {
    ...typography.body,
    color: colors.alert,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  retryButton: {
    backgroundColor: colors.highlight,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  retryButtonText: {
    ...typography.caption,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
});

export default HookDetailScreen;