import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator, 
  TouchableOpacity, 
  RefreshControl, 
  SafeAreaView 
} from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../styles/theme';
import HookCard from '../components/HookCard';
import { fetchHooks, Hook } from '../services/api';

type CategoryFilterProps = {
  name: string;
  color: string;
  isSelected: boolean;
  onPress: () => void;
};

const CategoryFilter = ({ name, color, isSelected, onPress }: CategoryFilterProps) => (
  <TouchableOpacity
    style={[
      styles.categoryChip,
      { borderColor: color },
      isSelected && { backgroundColor: color + '30' }
    ]}
    onPress={onPress}
  >
    <Text 
      style={[
        styles.categoryChipText, 
        { color: isSelected ? color : colors.textSecondary }
      ]}
    >
      {name}
    </Text>
  </TouchableOpacity>
);

const HookFeedScreen = () => {
  const [hooks, setHooks] = useState<Hook[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: 'All', color: colors.primary },
    { id: 'science', name: 'Science & Tech', color: colors.scienceTech },
    { id: 'arts', name: 'Arts & Creativity', color: colors.artsCreativity },
    { id: 'people', name: 'People & Society', color: colors.peopleSociety },
    { id: 'numbers', name: 'Numbers & Logic', color: colors.numbersLogic },
    { id: 'history', name: 'History & Culture', color: colors.historyCulture },
    { id: 'earth', name: 'Earth & Environment', color: colors.earthEnvironment },
  ];

  const loadHooks = async (category?: string) => {
    try {
      setLoading(true);
      const hooksData = await fetchHooks(category);
      setHooks(hooksData);
      setError(null);
    } catch (err) {
      setError('Failed to load hooks. Please try again later.');
      console.error('Error loading hooks:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadHooks();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadHooks(selectedCategory !== 'all' ? selectedCategory : undefined);
  };

  const handleCategoryPress = (categoryId: string) => {
    const category = categoryId === 'all' ? null : categoryId;
    setSelectedCategory(categoryId);
    loadHooks(category);
  };

  const handleRandomHook = () => {
    if (hooks.length > 0) {
      const randomIndex = Math.floor(Math.random() * hooks.length);
      const randomHook = hooks[randomIndex];
      // Navigate to random hook detail
      // navigation.navigate('HookDetail', { hookId: randomHook.id });
    }
  };

  const getCategoryColor = (category: string): string => {
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Discover Hooks</Text>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.categoriesScroll}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map(category => (
            <CategoryFilter
              key={category.id}
              name={category.name}
              color={category.color}
              isSelected={selectedCategory === category.id || (category.id === 'all' && selectedCategory === null)}
              onPress={() => handleCategoryPress(category.id)}
            />
          ))}
        </ScrollView>
        
        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.highlight} />
            <Text style={styles.loadingText}>Loading hooks...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton} 
              onPress={() => loadHooks(selectedCategory !== 'all' ? selectedCategory : undefined)}
            >
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView 
            style={styles.scrollView} 
            contentContainerStyle={styles.contentContainer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={colors.highlight}
                colors={[colors.highlight]}
              />
            }
          >
            {hooks.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No hooks found</Text>
              </View>
            ) : (
              hooks.map(hook => (
                <HookCard
                  key={hook.id}
                  id={hook.id}
                  title={hook.title}
                  content={hook.content}
                  analogy="It's like how you look different in mirrors vs. photos - you're used to one version of yourself"
                  category={hook.category}
                  categoryColor={getCategoryColor(hook.category)}
                  tags={['educational', 'beginner', 'fascinating']}
                />
              ))
            )}
          </ScrollView>
        )}
        
        <TouchableOpacity 
          style={styles.floatingButton} 
          onPress={handleRandomHook}
          activeOpacity={0.9}
        >
          <Text style={styles.floatingButtonText}>✨</Text>
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.headline,
    fontSize: 28,
  },
  categoriesScroll: {
    maxHeight: 60,
  },
  categoriesContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  categoryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    marginRight: spacing.sm,
  },
  categoryChipText: {
    ...typography.caption,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
    paddingTop: spacing.sm,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: spacing.xl * 2,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  floatingButton: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.medium,
  },
  floatingButtonText: {
    fontSize: 24,
    color: colors.textPrimary,
  },
});

export default HookFeedScreen;