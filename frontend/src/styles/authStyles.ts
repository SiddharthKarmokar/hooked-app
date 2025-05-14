import { StyleSheet, Platform } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../styles/theme';

/**
 * Shared styles for authentication screens (Login and Signup)
 * This ensures consistent styling across the authentication flow
 */
export const authStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 50,
  },
  logoText: {
    fontSize: 40,
    fontWeight: typography.weights.bold,
    color: colors.navy,
    marginLeft: 8,
    fontFamily: typography.fonts.bold,
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    width: '100%',
    minHeight: 60,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    marginBottom: 16,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  inputContainerError: {
    borderColor: colors.orange,
  },
  input: {
    fontSize: 18,
    color: colors.darkText,
    width: '100%',
    height: 60,
    fontFamily: typography.fonts.regular,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
  },
  errorText: {
    color: colors.orange,
    fontSize: typography.sizes.small,
    position: 'absolute',
    bottom: -20,
    left: 16,
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 93, 51, 0.1)',
    borderRadius: 12,
    padding: spacing.m,
    marginBottom: spacing.m,
  },
  errorMessage: {
    color: colors.orange,
    fontSize: typography.sizes.small,
    textAlign: 'center',
    fontFamily: typography.fonts.medium,
  },
  primaryButton: {
    width: '100%',
    height: 60,
    backgroundColor: colors.blue,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  secondaryButton: {
    width: '100%',
    height: 60,
    backgroundColor: 'transparent',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.navy,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: colors.whiteText,
    fontSize: typography.sizes.medium,
    fontWeight: typography.weights.semiBold,
    fontFamily: typography.fonts.semiBold,
  },
  secondaryButtonText: {
    color: colors.navy,
    fontSize: typography.sizes.medium,
    fontWeight: typography.weights.semiBold,
    fontFamily: typography.fonts.semiBold,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: colors.blue,
    fontSize: typography.sizes.small,
    fontFamily: typography.fonts.regular,
  },

  // Additional styles for platform-specific and UX enhancements
  keyboardAvoidingView: {
    flex: 1,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  logoShadow: Platform.OS === 'ios' 
    ? {
        shadowColor: colors.navy,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      }
    : {
        elevation: 4,
      },
  inputContainerFocused: {
    borderColor: colors.blue,
    borderWidth: 1.5,
  },
});

export default authStyles;
