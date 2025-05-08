// Define color palette for the HookED app based on Gen Z/Alpha preferences
export const colors = {
  // Primary Colors
  primary: '#6600FF', // Electric Indigo
  accent: '#FFD300', // Cyber Yellow
  highlight: '#FF3399', // Neon Pink
  success: '#24FF9B', // Mint Green
  background: '#121212', // Space Black

  // Secondary Colors
  secondary: '#A98CFF', // Lavender
  warmAccent: '#FFAA85', // Peach
  coolAccent: '#35EEEE', // Turquoise
  alert: '#FF5C64', // Coral

  // Subject Categories
  scienceTech: '#00CCFF', // Electric Blue
  artsCreativity: '#FF3399', // Neon Pink
  peopleSociety: '#CC99FF', // Light Purple
  numbersLogic: '#24FF9B', // Mint Green
  historyCulture: '#FFBF40', // Amber
  earthEnvironment: '#00CC99', // Emerald

  // Text Colors
  textPrimary: '#FFFFFF',
  textSecondary: '#CCCCCC',
  textTertiary: '#999999',
  
  // UI Elements
  cardBackground: '#1E1E1E',
  inputBackground: '#2A2A2A',
  divider: '#333333',
};

// Typography styles with system font fallbacks
// Note: We're using system fonts as placeholders for the specified custom fonts:
// - "Space Grotesk" for headlines
// - "Outfit" for body text
// - "Silkscreen" for accent text
export const typography = {
  headline: {
    fontFamily: 'System',
    fontSize: 24,
    lineHeight: 32,
    color: colors.textPrimary,
    fontWeight: 'bold',
  },
  subheadline: {
    fontFamily: 'System',
    fontSize: 18,
    lineHeight: 24,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  body: {
    fontFamily: 'System',
    fontSize: 16,
    lineHeight: 22,
    color: colors.textPrimary,
  },
  bodyMedium: {
    fontFamily: 'System',
    fontSize: 16,
    lineHeight: 22,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  caption: {
    fontFamily: 'System',
    fontSize: 14,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  accentText: {
    fontFamily: 'System',
    fontSize: 12,
    lineHeight: 16,
    color: colors.highlight,
    fontWeight: 'bold',
  },
};

// Spacing for consistent layout
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border radius
export const borderRadius = {
  sm: 8,
  md: 16,
  lg: 24,
  full: 9999,
};

// Shadow styles
export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
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