import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius, shadows } from '../styles/theme';
import PlaceholderImage from '../assets/images/placeholder';

type HookCardProps = {
  id: string;
  title: string;
  content?: string;
  analogy?: string;
  category: string;
  categoryColor: string;
  tags?: string[];
  imageUrl?: string;
};

const HookCard = ({ id, title, content, analogy, category, categoryColor, tags, imageUrl }: HookCardProps) => {
  const navigation = useNavigation();

  const handlePress = () => {
    //@ts-ignore
    navigation.navigate('HookDetail', { hookId: id });
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <PlaceholderImage />
        <View style={[styles.categoryTag, { backgroundColor: categoryColor }]}>
          <Text style={styles.categoryText}>{category}</Text>
        </View>
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        
        {content && (
          <Text style={styles.content} numberOfLines={2}>{content}</Text>
        )}
        
        {analogy && (
          <View style={styles.analogyContainer}>
            <Text style={styles.analogyLabel}>ANALOGY</Text>
            <Text style={styles.analogy}>{analogy}</Text>
          </View>
        )}
        
        <View style={styles.footer}>
          {tags && tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {tags.slice(0, 2).map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
              {tags.length > 2 && (
                <Text style={styles.moreTagsText}>+{tags.length - 2}</Text>
              )}
            </View>
          )}
          
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>♡</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>⇗</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.medium,
  },
  imageContainer: {
    height: 160,
    width: '100%',
    backgroundColor: colors.lightGray,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  categoryTag: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  categoryText: {
    fontSize: typography.sizes.tiny,
    fontWeight: typography.weights.bold,
    color: colors.white,
    fontFamily: typography.fonts.bold,
  },
  contentContainer: {
    width: '100%',
  },
  title: {
    fontSize: typography.sizes.medium,
    fontWeight: typography.weights.bold,
    color: colors.darkText,
    marginBottom: spacing.xs,
    fontFamily: typography.fonts.bold,
  },
  content: {
    fontSize: typography.sizes.small,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    fontFamily: typography.fonts.regular,
  },
  analogyContainer: {
    backgroundColor: colors.cream,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  analogyLabel: {
    fontSize: typography.sizes.tiny,
    color: colors.accent,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.xs,
    fontFamily: typography.fonts.bold,
  },
  analogy: {
    fontSize: typography.sizes.small,
    fontStyle: 'italic',
    color: colors.darkText,
    fontFamily: typography.fonts.regular,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tag: {
    backgroundColor: colors.inputBackground,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginRight: spacing.xs,
  },
  tagText: {
    fontSize: typography.sizes.tiny,
    color: colors.textSecondary,
    fontFamily: typography.fonts.regular,
  },
  moreTagsText: {
    fontSize: typography.sizes.tiny,
    color: colors.textTertiary,
    fontFamily: typography.fonts.regular,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  actionIcon: {
    fontSize: 18,
    color: colors.textSecondary,
  },
});

export default HookCard;
