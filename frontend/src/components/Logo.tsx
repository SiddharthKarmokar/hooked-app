import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../styles/theme';

type LogoProps = {
  withTagline?: boolean;
  size?: 'large' | 'small';
};

const Logo = ({ withTagline = true, size = 'large' }: LogoProps) => {
  const logoSize = size === 'large' ? typography.sizes.extraLarge : typography.sizes.large;
  const taglineSize = size === 'large' ? typography.sizes.regular : typography.sizes.small;

  return (
    <View style={styles.container}>
      <View style={styles.logoRow}>
        <Text style={[styles.logoIcon, { fontSize: logoSize }]}>9</Text>
        <Text style={[styles.logoText, { fontSize: logoSize }]}>HookED</Text>
      </View>
      
      {withTagline && (
        <Text style={[styles.tagline, { fontSize: taglineSize }]}>
          If it slaps, it teaches. And that's Hooked.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    color: colors.orange,
    fontFamily: typography.fonts.bold,
    fontWeight: typography.weights.bold,
    marginRight: 4,
    transform: [{ rotate: '-10deg' }],
  },
  logoText: {
    color: colors.navy,
    fontFamily: typography.fonts.bold,
    fontWeight: typography.weights.bold,
  },
  tagline: {
    color: colors.navy,
    fontFamily: typography.fonts.regular,
    marginTop: spacing.s,
    textAlign: 'center',
  },
});

export default Logo;
