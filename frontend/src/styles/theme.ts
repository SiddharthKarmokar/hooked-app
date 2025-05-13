// Define color palette for the HookED app based on exact specifications
export const colors = {
  // Primary Colors
  navy: '#0E1E49',          // Dark navy for text and logo
  orange: '#FF5D33',        // Bright orange for buttons and accent
  blue: '#3165FF',          // Royal blue for buttons in alternating pattern
  
  // Background colors
  cream: '#F9F8F6',         // Warm off-white/cream background
  white: '#FFFFFF',         // White for cards
  lightGray: '#F5F5F5',     // Light gray for search bar
  
  // Text colors
  darkText: '#0E1E49',      // Navy for primary text
  grayText: '#84879B',      // Gray for secondary text
  blueText: '#4B75E8',      // Blue for links/references
  whiteText: '#FFFFFF',     // White text on buttons

  // Category colors (kept for backward compatibility)
  scienceTech: '#00CCFF',
  artsCreativity: '#FF3399',
  peopleSociety: '#CC99FF',
  numbersLogic: '#24FF9B',
  historyCulture: '#FFBF40',
  earthEnvironment: '#00CC99',

  // Legacy colors for backward compatibility
  primary: '#3165FF',
  accent: '#FF5D33',
  highlight: '#FF5D33',
  success: '#24FF9B',
  background: '#FAFAFA',
  textPrimary: '#0E1E49',
  textSecondary: '#84879B',
  textTertiary: '#84879B',
  cardBackground: '#FFFFFF',
  inputBackground: '#F5F5F5',
  divider: '#F5F5F5',
};

// Typography definitions
export const typography = {
  // Font families - use system fonts for now
  fonts: {
    regular: 'System',
    medium: 'System',
    semiBold: 'System',
    bold: 'System',
  },
  
  // Font sizes
  sizes: {
    extraLarge: 32,
    large: 24,
    medium: 20,
    regular: 16,
    small: 14,
    tiny: 12,
  },
  
  // Font weights
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
  },
  
  // Legacy style objects for backward compatibility
  headline: {
    fontFamily: 'System',
    fontSize: 32,
    lineHeight: 40,
    color: colors.darkText,
    fontWeight: '700',
  },
  subheadline: {
    fontFamily: 'System',
    fontSize: 24,
    lineHeight: 32,
    color: colors.darkText,
    fontWeight: '600',
  },
  body: {
    fontFamily: 'System',
    fontSize: 16,
    lineHeight: 22,
    color: colors.darkText,
  },
  bodyMedium: {
    fontFamily: 'System',
    fontSize: 16,
    lineHeight: 22,
    color: colors.darkText,
    fontWeight: '500',
  },
  caption: {
    fontFamily: 'System',
    fontSize: 14,
    lineHeight: 18,
    color: colors.grayText,
  },
  accentText: {
    fontFamily: 'System',
    fontSize: 12,
    lineHeight: 16,
    color: colors.orange,
    fontWeight: '700',
  },
};

// Spacing and layout measurements
export const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
  // Legacy keys for backward compatibility
  sm: 8,
  md: 16,
  lg: 24,
};

// Border radius definitions
export const borderRadius = {
  buttonRadius: 24,
  cardRadius: 16,
  searchRadius: 24,
  // Legacy keys for backward compatibility
  small: 8,
  medium: 16,
  large: 24,
  full: 9999,
  sm: 8,
  md: 16,
  lg: 24,
};

// Shadow styles
export const shadows = {
  small: {
    shadowColor: colors.navy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: colors.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4.65,
    elevation: 3,
  },
  large: {
    shadowColor: colors.navy,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 7.49,
    elevation: 8,
  },
};

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
};