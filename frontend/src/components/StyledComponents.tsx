import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../styles/theme';

// Container component for screen layouts
export const Container = (props: any) => (
  <View 
    style={[
      { 
        flex: 1, 
        backgroundColor: colors.cream,
        padding: spacing.l,
      }, 
      props.style
    ]}
    {...props}
  />
);

// Heading component for large titles
export const Heading = (props: any) => (
  <Text 
    style={[
      {
        fontSize: typography.sizes.extraLarge,
        fontWeight: typography.weights.bold,
        color: colors.darkText,
        marginBottom: spacing.s,
        fontFamily: typography.fonts.bold,
      },
      props.style
    ]}
    {...props}
  />
);

// Subheading component for section titles or subtitles
export const Subheading = (props: any) => (
  <Text 
    style={[
      {
        fontSize: typography.sizes.regular,
        color: colors.darkText,
        marginBottom: spacing.m,
        fontFamily: typography.fonts.regular,
      },
      props.style
    ]}
    {...props}
  />
);

// Blue button component
export const BlueButton = ({ title, onPress, style, ...rest }: any) => (
  <TouchableOpacity 
    onPress={onPress}
    style={[
      {
        backgroundColor: colors.blue,
        borderRadius: borderRadius.buttonRadius,
        paddingVertical: spacing.m,
        paddingHorizontal: spacing.l,
        alignItems: 'center',
        justifyContent: 'center',
      },
      style
    ]}
    {...rest}
  >
    <Text 
      style={{ 
        color: colors.whiteText, 
        fontWeight: typography.weights.semiBold,
        fontFamily: typography.fonts.semiBold,
        fontSize: typography.sizes.regular,
      }}
    >
      {title}
    </Text>
  </TouchableOpacity>
);

// Orange button component
export const OrangeButton = ({ title, onPress, style, ...rest }: any) => (
  <TouchableOpacity 
    onPress={onPress}
    style={[
      {
        backgroundColor: colors.orange,
        borderRadius: borderRadius.buttonRadius,
        paddingVertical: spacing.m,
        paddingHorizontal: spacing.l,
        alignItems: 'center',
        justifyContent: 'center',
      },
      style
    ]}
    {...rest}
  >
    <Text 
      style={{ 
        color: colors.whiteText, 
        fontWeight: typography.weights.semiBold,
        fontFamily: typography.fonts.semiBold,
        fontSize: typography.sizes.regular,
      }}
    >
      {title}
    </Text>
  </TouchableOpacity>
);

// Search bar component
export const SearchBar = ({ placeholder, onChangeText, value, style, ...rest }: any) => (
  <View 
    style={[
      {
        backgroundColor: colors.lightGray,
        borderRadius: borderRadius.searchRadius,
        paddingHorizontal: spacing.m,
        paddingVertical: spacing.s,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.m,
      },
      style
    ]}
    {...rest}
  >
    <Text>🔍</Text>
    <TextInput
      placeholder={placeholder || "Search"}
      placeholderTextColor={colors.grayText}
      onChangeText={onChangeText}
      value={value}
      style={{
        flex: 1,
        marginLeft: spacing.s,
        fontSize: typography.sizes.regular,
        fontFamily: typography.fonts.regular,
        color: colors.darkText,
      }}
    />
  </View>
);

// Card component for content display
export const Card = ({ image, title, description, source, style, ...rest }: any) => (
  <View 
    style={[
      {
        backgroundColor: colors.white,
        borderRadius: borderRadius.cardRadius,
        overflow: 'hidden',
        marginBottom: spacing.l,
        ...shadows.medium,
      },
      style
    ]}
    {...rest}
  >
    {image && (
      <View style={{ width: '100%', height: 200 }}>
        {image}
      </View>
    )}
    <View style={{ padding: spacing.m }}>
      <Text 
        style={{
          fontSize: typography.sizes.medium,
          fontWeight: typography.weights.bold,
          fontFamily: typography.fonts.bold,
          color: colors.darkText,
          marginBottom: spacing.xs,
        }}
      >
        {title}
      </Text>
      {description && (
        <Text 
          style={{
            fontSize: typography.sizes.small,
            fontFamily: typography.fonts.regular,
            color: colors.grayText,
            marginBottom: spacing.s,
            lineHeight: 20,
          }}
        >
          {description}
        </Text>
      )}
      {source && (
        <Text 
          style={{
            fontSize: typography.sizes.tiny,
            fontFamily: typography.fonts.regular,
            color: colors.blueText,
          }}
        >
          {source}
        </Text>
      )}
    </View>
  </View>
);

// XP Counter component
export const XpCounter = ({ count, style }: any) => (
  <View
    style={[
      {
        backgroundColor: colors.orange,
        borderRadius: borderRadius.buttonRadius,
        paddingVertical: spacing.s,
        paddingHorizontal: spacing.m,
        flexDirection: 'row',
        alignItems: 'center',
      },
      style
    ]}
  >
    <Text>⭐</Text>
    <Text
      style={{
        color: colors.whiteText,
        marginLeft: spacing.s,
        fontWeight: typography.weights.semiBold,
        fontFamily: typography.fonts.semiBold,
        fontSize: typography.sizes.regular,
      }}
    >
      {count} XP
    </Text>
  </View>
);

// Daily button component
export const DailyButton = ({ onPress, style }: any) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      {
        backgroundColor: colors.blue,
        borderRadius: borderRadius.buttonRadius,
        paddingVertical: spacing.s,
        paddingHorizontal: spacing.m,
      },
      style
    ]}
  >
    <Text
      style={{
        color: colors.whiteText,
        fontFamily: typography.fonts.semiBold,
        fontWeight: typography.weights.semiBold,
        fontSize: typography.sizes.regular,
      }}
    >
      Daily
    </Text>
  </TouchableOpacity>
);
