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
    // @ts-ignore
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
    backgroundColor: colors.white,
    borderRadius: borderRadius.cardRadius,
    marginBottom: spacing.l,
    overflow: 'hidden',
    ...shadows.medium,
  },
  imageContainer: {
    height: 160,
    width: '100%',
    position: 'relative',
  },
  categoryTag: {
    position: 'absolute',
    top: spacing.m,
    left: spacing.m,
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.buttonRadius,
  },
  categoryText: {
    fontSize: typography.sizes.tiny,
    fontWeight: 'bold',
    color: colors.white,
    fontFamily: typography.fonts.bold,
  },
  contentContainer: {
    padding: spacing.m,
  },
  title: {
    fontSize: typography.sizes.medium,
    fontWeight: 'bold',
    color: colors.navy,
    marginBottom: spacing.s,
    fontFamily: typography.fonts.bold,
  },
  content: {
    fontSize: typography.sizes.small,
    color: colors.grayText,
    marginBottom: spacing.m,
    lineHeight: 20,
    fontFamily: typography.fonts.regular,
  },
  analogyContainer: {
    backgroundColor: colors.cream,
    borderRadius: borderRadius.searchRadius,
    padding: spacing.s,
    marginBottom: spacing.m,
  },
  analogyLabel: {
    fontSize: typography.sizes.tiny,
    color: colors.blue,
    fontWeight: 'bold',
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
    marginTop: spacing.s,
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tag: {
    backgroundColor: colors.lightGray,
    borderRadius: borderRadius.searchRadius,
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs,
    marginRight: spacing.xs,
  },
  tagText: {
    fontSize: typography.sizes.tiny,
    color: colors.grayText,
    fontFamily: typography.fonts.regular,
  },
  moreTagsText: {
    fontSize: typography.sizes.tiny,
    color: colors.grayText,
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
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.s,
  },
  actionIcon: {
    fontSize: 18,
    color: colors.grayText,
  },
});

export default HookCard;
