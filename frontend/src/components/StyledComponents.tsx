import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image, ViewStyle, TextStyle } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../styles/theme';

// Define types for props
interface ContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  [key: string]: any;
}

interface TextComponentProps {
  children: React.ReactNode;
  style?: TextStyle;
  [key: string]: any;
}

interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  disabled?: boolean;
  [key: string]: any;
}

interface SearchBarProps {
  placeholder?: string;
  onChangeText: (text: string) => void;
  value: string;
  style?: ViewStyle;
  [key: string]: any;
}

interface CardProps {
  image?: React.ReactNode;
  title: string;
  description?: string;
  source?: string;
  style?: ViewStyle;
  [key: string]: any;
}

interface XpCounterProps {
  count: number;
  style?: ViewStyle;
}

interface DailyButtonProps {
  onPress: () => void;
  style?: ViewStyle;
}

// Container component for screen layouts
export const Container = ({ children, style, ...rest }: ContainerProps) => (
  <View 
    style={[
      { 
        flex: 1, 
        backgroundColor: colors.cream,
        padding: spacing.l,
      }, 
      style
    ]}
    {...rest}
  >
    {children}
  </View>
);

// Heading component for large titles
export const Heading = ({ children, style, ...rest }: TextComponentProps) => (
  <Text 
    style={[
      {
        fontSize: typography.sizes.extraLarge,
        fontWeight: typography.weights.bold,
        color: colors.darkText,
        marginBottom: spacing.s,
        fontFamily: typography.fonts.bold,
      },
      style
    ]}
    {...rest}
  >
    {children}
  </Text>
);

// Subheading component for section titles or subtitles
export const Subheading = ({ children, style, ...rest }: TextComponentProps) => (
  <Text 
    style={[
      {
        fontSize: typography.sizes.regular,
        color: colors.darkText,
        marginBottom: spacing.m,
        fontFamily: typography.fonts.regular,
      },
      style
    ]}
    {...rest}
  >
    {children}
  </Text>
);

// Blue button component
export const BlueButton = ({ title, onPress, style, disabled = false, ...rest }: ButtonProps) => (
  <TouchableOpacity 
    onPress={onPress}
    disabled={disabled}
    style={[
      {
        backgroundColor: colors.blue,
        borderRadius: borderRadius.buttonRadius,
        paddingVertical: spacing.m,
        paddingHorizontal: spacing.l,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: disabled ? 0.6 : 1,
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
export const OrangeButton = ({ title, onPress, style, disabled = false, ...rest }: ButtonProps) => (
  <TouchableOpacity 
    onPress={onPress}
    disabled={disabled}
    style={[
      {
        backgroundColor: colors.orange,
        borderRadius: borderRadius.buttonRadius,
        paddingVertical: spacing.m,
        paddingHorizontal: spacing.l,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: disabled ? 0.6 : 1,
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
export const SearchBar = ({ placeholder, onChangeText, value, style, ...rest }: SearchBarProps) => (
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
export const Card = ({ image, title, description, source, style, ...rest }: CardProps) => (
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
export const XpCounter = ({ count, style }: XpCounterProps) => (
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
export const DailyButton = ({ onPress, style }: DailyButtonProps) => (
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

// Secondary button with outline
export const SecondaryButton = ({ title, onPress, style, disabled = false, ...rest }: ButtonProps) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    style={[
      {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.blue,
        borderRadius: borderRadius.buttonRadius,
        paddingVertical: spacing.m,
        paddingHorizontal: spacing.l,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: disabled ? 0.6 : 1,
      },
      style
    ]}
    {...rest}
  >
    <Text
      style={{
        color: colors.blue,
        fontWeight: typography.weights.semiBold,
        fontFamily: typography.fonts.semiBold,
        fontSize: typography.sizes.regular,
      }}
    >
      {title}
    </Text>
  </TouchableOpacity>
);

// Divider component
export const Divider = ({ style }: { style?: ViewStyle }) => (
  <View
    style={[
      {
        height: 1,
        backgroundColor: colors.lightGray,
        width: '100%',
        marginVertical: spacing.m,
      },
      style
    ]}
  />
);

// Category tag component
interface CategoryTagProps {
  label: string;
  color: string;
  style?: ViewStyle;
  onPress?: () => void;
}

export const CategoryTag = ({ label, color, style, onPress }: CategoryTagProps) => (
  <TouchableOpacity
    disabled={!onPress}
    onPress={onPress}
    style={[
      {
        backgroundColor: color,
        borderRadius: 20,
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.m,
        alignSelf: 'flex-start',
      },
      style
    ]}
  >
    <Text
      style={{
        color: colors.whiteText,
        fontSize: typography.sizes.small,
        fontFamily: typography.fonts.medium,
        fontWeight: typography.weights.medium,
      }}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

// Body text component
export const BodyText = ({ children, style, ...rest }: TextComponentProps) => (
  <Text
    style={[
      {
        fontSize: typography.sizes.regular,
        fontFamily: typography.fonts.regular,
        color: colors.darkText,
        lineHeight: 22,
      },
      style
    ]}
    {...rest}
  >
    {children}
  </Text>
);

// Caption text component
export const CaptionText = ({ children, style, ...rest }: TextComponentProps) => (
  <Text
    style={[
      {
        fontSize: typography.sizes.small,
        fontFamily: typography.fonts.regular,
        color: colors.grayText,
      },
      style
    ]}
    {...rest}
  >
    {children}
  </Text>
);

// Input field component
interface InputFieldProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  error?: string;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  [key: string]: any;
}

export const InputField = ({ 
  label, 
  placeholder, 
  value, 
  onChangeText, 
  secureTextEntry = false,
  error,
  style,
  inputStyle,
  ...rest 
}: InputFieldProps) => (
  <View style={[styles.inputFieldContainer, style]}>
    {label && (
      <Text style={styles.inputLabel}>{label}</Text>
    )}
    <TextInput
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      style={[styles.inputField, error && styles.inputFieldError, inputStyle]}
      placeholderTextColor={colors.grayText}
      {...rest}
    />
    {error && (
      <Text style={styles.errorText}>{error}</Text>
    )}
  </View>
);

// Checkbox component
interface CheckboxProps {
  checked: boolean;
  onPress: () => void;
  label: string;
  style?: ViewStyle;
  [key: string]: any;
}

export const Checkbox = ({ checked, onPress, label, style, ...rest }: CheckboxProps) => (
  <TouchableOpacity 
    onPress={onPress}
    style={[styles.checkboxContainer, style]}
    {...rest}
  >
    <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
      {checked && <Text style={styles.checkmark}>✓</Text>}
    </View>
    <Text style={styles.checkboxLabel}>{label}</Text>
  </TouchableOpacity>
);

// Badge component
interface BadgeProps {
  count: number;
  style?: ViewStyle;
  [key: string]: any;
}

export const Badge = ({ count, style, ...rest }: BadgeProps) => (
  <View style={[styles.badge, style]} {...rest}>
    <Text style={styles.badgeText}>
      {count > 99 ? '99+' : count}
    </Text>
  </View>
);

// Progress bar component
interface ProgressBarProps {
  progress: number; // 0 to 1
  height?: number;
  backgroundColor?: string;
  progressColor?: string;
  style?: ViewStyle;
  [key: string]: any;
}

export const ProgressBar = ({ 
  progress, 
  height = 8, 
  backgroundColor = colors.lightGray,
  progressColor = colors.blue,
  style,
  ...rest 
}: ProgressBarProps) => {
  // Make sure progress is between 0 and 1
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  
  return (
    <View 
      style={[
        {
          height,
          backgroundColor,
          borderRadius: height / 2,
          overflow: 'hidden',
          width: '100%',
        },
        style
      ]}
      {...rest}
    >
      <View
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: `${clampedProgress * 100}%`,
          backgroundColor: progressColor,
          borderRadius: height / 2,
        }}
      />
    </View>
  );
};

// Topic bubble component for interest selection
interface TopicBubbleProps {
  title: string;
  selected: boolean;
  size?: 'small' | 'medium' | 'large';
  onPress: () => void;
  style?: ViewStyle;
  [key: string]: any;
}

export const TopicBubble = ({ 
  title, 
  selected, 
  size = 'medium',
  onPress, 
  style,
  ...rest 
}: TopicBubbleProps) => {
  // Define sizes for different bubble variants
  const sizeStyles = {
    small: { width: 100, height: 40 },
    medium: { width: 150, height: 50 },
    large: { width: 200, height: 60 },
  };
  
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          ...sizeStyles[size],
          backgroundColor: selected ? colors.blue : colors.white,
          borderRadius: borderRadius.buttonRadius,
          justifyContent: 'center',
          alignItems: 'center',
          margin: spacing.xs,
          ...shadows.small,
          borderWidth: 1,
          borderColor: selected ? colors.blue : colors.lightGray,
        },
        style
      ]}
      {...rest}
    >
      <Text
        style={{
          color: selected ? colors.white : colors.darkText,
          fontSize: typography.sizes.regular,
          fontWeight: typography.weights.medium,
          fontFamily: typography.fonts.medium,
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

// Avatar component
interface AvatarProps {
  source?: { uri: string } | number;
  size?: number;
  name?: string;
  style?: ViewStyle;
  [key: string]: any;
}

export const Avatar = ({ 
  source, 
  size = 50, 
  name = '',
  style,
  ...rest 
}: AvatarProps) => {
  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: source ? 'transparent' : colors.blue,
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
        },
        style
      ]}
      {...rest}
    >
      {source ? (
        <Image
          source={source}
          style={{
            width: size,
            height: size,
          }}
        />
      ) : (
        <Text
          style={{
            color: colors.white,
            fontSize: size / 3,
            fontWeight: typography.weights.bold,
            fontFamily: typography.fonts.bold,
          }}
        >
          {getInitials(name)}
        </Text>
      )}
    </View>
  );
};

// Add to the existing styles
const styles = StyleSheet.create({
  // Input field styles
  inputFieldContainer: {
    marginBottom: spacing.m,
    width: '100%',
  },
  inputLabel: {
    fontSize: typography.sizes.small,
    color: colors.darkText,
    marginBottom: spacing.xs,
    fontFamily: typography.fonts.medium,
    fontWeight: typography.weights.medium,
  },
  inputField: {
    backgroundColor: colors.lightGray,
    borderRadius: borderRadius.searchRadius,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.m,
    fontSize: typography.sizes.regular,
    color: colors.darkText,
    fontFamily: typography.fonts.regular,
    width: '100%',
  },
  inputFieldError: {
    borderWidth: 1,
    borderColor: colors.orange,
  },
  errorText: {
    color: colors.orange,
    fontSize: typography.sizes.small,
    marginTop: spacing.xs,
    fontFamily: typography.fonts.regular,
  },
  
  // Checkbox styles
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.blue,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.s,
    backgroundColor: colors.white,
  },
  checkboxChecked: {
    backgroundColor: colors.blue,
  },
  checkmark: {
    color: colors.white,
    fontSize: 14,
    fontWeight: typography.weights.bold,
  },
  checkboxLabel: {
    fontSize: typography.sizes.regular,
    color: colors.darkText,
    fontFamily: typography.fonts.regular,
  },
  
  // Badge styles
  badge: {
    backgroundColor: colors.orange,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  badgeText: {
    color: colors.white,
    fontSize: typography.sizes.tiny,
    fontWeight: typography.weights.bold,
    fontFamily: typography.fonts.bold,
  },
});
