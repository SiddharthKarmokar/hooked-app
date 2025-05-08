import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius, shadows } from '../styles/theme';

type HookCardProps = {
  id: string;
  title: string;
  content?: string;
  analogy?: string;
  category: string;
  categoryColor: string;
  tags?: string[];
};

const HookCard = ({ id, title, content, analogy, category, categoryColor, tags }: HookCardProps) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('HookDetail', { hookId: id });
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <View style={[styles.categoryTag, { backgroundColor: categoryColor }]}>
        <Text style={styles.categoryText}>{category}</Text>
      </View>
      
      <Text style={styles.title}>{title}</Text>
      
      {content && (
        <Text style={styles.content}>{content}</Text>
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
  categoryTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginBottom: spacing.sm,
  },
  categoryText: {
    ...typography.caption,
    fontWeight: 'bold',
    color: colors.background,
  },
  title: {
    ...typography.headline,
    marginBottom: spacing.sm,
  },
  content: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  analogyContainer: {
    backgroundColor: colors.background + '80',
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  analogyLabel: {
    ...typography.caption,
    color: colors.accent,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  analogy: {
    ...typography.body,
    fontStyle: 'italic',
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
    ...typography.caption,
    color: colors.textSecondary,
  },
  moreTagsText: {
    ...typography.caption,
    color: colors.textTertiary,
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