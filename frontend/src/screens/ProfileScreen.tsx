import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { colors, typography, spacing } from '../styles/theme';

const ProfileScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImage} />
        </View>
        <Text style={styles.username}>User123</Text>
        <Text style={styles.bio}>Learning enthusiast interested in science and history</Text>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>24</Text>
          <Text style={styles.statLabel}>Saved</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>5</Text>
          <Text style={styles.statLabel}>Contributed</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Activity</Text>
        <View style={styles.activityList}>
          <View style={styles.activityItem}>
            <Text style={styles.activityText}>You saved "Why is the sky blue?"</Text>
            <Text style={styles.activityTime}>3 hours ago</Text>
          </View>
          <View style={styles.activityItem}>
            <Text style={styles.activityText}>You viewed "How do planes fly?"</Text>
            <Text style={styles.activityTime}>Yesterday</Text>
          </View>
          <View style={styles.activityItem}>
            <Text style={styles.activityText}>You commented on "What causes thunder?"</Text>
            <Text style={styles.activityTime}>2 days ago</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    paddingTop: spacing.xl * 1.5,
    alignItems: 'center',
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: spacing.md,
    padding: 3,
    backgroundColor: colors.highlight,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    backgroundColor: colors.cardBackground,
  },
  username: {
    ...typography.headline,
    fontSize: 22,
    marginBottom: spacing.xs,
  },
  bio: {
    ...typography.body,
    textAlign: 'center',
    color: colors.textSecondary,
    paddingHorizontal: spacing.lg,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: spacing.lg,
    marginVertical: spacing.lg,
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: spacing.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    ...typography.headline,
    fontSize: 20,
  },
  statLabel: {
    ...typography.caption,
  },
  section: {
    padding: spacing.lg,
  },
  sectionTitle: {
    ...typography.subheadline,
    marginBottom: spacing.md,
  },
  activityList: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
  },
  activityItem: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  activityText: {
    ...typography.body,
  },
  activityTime: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
});

export default ProfileScreen;