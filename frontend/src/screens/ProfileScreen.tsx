import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../styles/theme';

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
    backgroundColor: colors.cream,
  },
  header: {
    padding: spacing.l,
    paddingTop: spacing.xl * 1.5,
    alignItems: 'center',
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: spacing.m,
    padding: 3,
    backgroundColor: colors.blue,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    backgroundColor: colors.lightGray,
  },
  username: {
    fontSize: typography.sizes.large,
    fontWeight: typography.weights.bold,
    color: colors.navy,
    marginBottom: spacing.xs,
  },
  bio: {
    fontSize: typography.sizes.regular,
    textAlign: 'center',
    color: colors.grayText,
    paddingHorizontal: spacing.l,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: spacing.l,
    marginVertical: spacing.l,
    backgroundColor: colors.white,
    borderRadius: borderRadius.cardRadius,
    padding: spacing.m,
    ...shadows.small,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: typography.sizes.medium,
    fontWeight: typography.weights.bold,
    color: colors.navy,
  },
  statLabel: {
    fontSize: typography.sizes.small,
    color: colors.grayText,
  },
  section: {
    padding: spacing.l,
  },
  sectionTitle: {
    fontSize: typography.sizes.medium,
    fontWeight: typography.weights.bold,
    color: colors.navy,
    marginBottom: spacing.m,
  },
  activityList: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.cardRadius,
  },
  activityItem: {
    padding: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  activityText: {
    fontSize: typography.sizes.regular,
    color: colors.navy,
  },
  activityTime: {
    fontSize: typography.sizes.tiny,
    color: colors.grayText,
    marginTop: spacing.xs,
  },
});

export default ProfileScreen;
