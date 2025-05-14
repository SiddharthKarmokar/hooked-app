import { Animated, Easing } from 'react-native';

/**
 * Utility functions for animations in the HookED application
 * Provides consistent animation styles across different screens
 */
export const AnimationUtils = {
  /**
   * Creates a fade-in animation
   * @param fadeAnim The animated value to control the fade
   * @param duration The duration of the animation in milliseconds (default: 300)
   * @param callback Optional callback to execute when animation completes
   */
  fadeIn: (fadeAnim: Animated.Value, duration = 300, callback?: () => void) => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration,
      useNativeDriver: true,
      easing: Easing.ease,
    }).start(callback);
  },

  /**
   * Creates a fade-out animation
   * @param fadeAnim The animated value to control the fade
   * @param duration The duration of the animation in milliseconds (default: 300)
   * @param callback Optional callback to execute when animation completes
   */
  fadeOut: (fadeAnim: Animated.Value, duration = 300, callback?: () => void) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration,
      useNativeDriver: true,
      easing: Easing.ease,
    }).start(callback);
  },

  /**
   * Creates a slide-up animation from bottom
   * @param slideAnim The animated value to control the slide
   * @param duration The duration of the animation in milliseconds (default: 500)
   * @param callback Optional callback to execute when animation completes 
   */
  slideUp: (slideAnim: Animated.Value, duration = 500, callback?: () => void) => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start(callback);
  },

  /**
   * Creates a slide-down animation
   * @param slideAnim The animated value to control the slide
   * @param toValue The value to slide to (e.g., screen height)
   * @param duration The duration of the animation in milliseconds (default: 500)
   * @param callback Optional callback to execute when animation completes
   */
  slideDown: (slideAnim: Animated.Value, toValue: number, duration = 500, callback?: () => void) => {
    Animated.timing(slideAnim, {
      toValue,
      duration,
      useNativeDriver: true,
      easing: Easing.in(Easing.cubic),
    }).start(callback);
  },

  /**
   * Creates a pulse animation (scale up and down)
   * @param scaleAnim The animated value to control the scale
   * @param callback Optional callback to execute when animation completes
   */
  pulse: (scaleAnim: Animated.Value, callback?: () => void) => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 150,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
        easing: Easing.in(Easing.ease),
      }),
    ]).start(callback);
  },
};

export default AnimationUtils;
