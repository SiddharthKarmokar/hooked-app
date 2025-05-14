/**
 * Authentication Service for HookED app
 * Handles login, signup, and token management
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// API URL - replace with your actual API base URL
const API_URL = 'https://api.hooked-app.com';

// Storage keys
const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  xpPoints?: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}

/**
 * Authentication service class
 */
class AuthService {
  /**
   * Login a user with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data: AuthResponse = await response.json();
      
      // Store auth data
      await this.saveAuthData(data);
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Register a new user
   */
  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Signup failed');
      }

      const data: AuthResponse = await response.json();
      
      // Store auth data
      await this.saveAuthData(data);
      
      return data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  /**
   * Log out the current user
   */
  async logout(): Promise<void> {
    try {
      // Clear stored auth data
      await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, USER_DATA_KEY]);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  /**
   * Check if the user is currently logged in
   */
  async isLoggedIn(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      return !!token;
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  }

  /**
   * Get the current user data
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(USER_DATA_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }

  /**
   * Get the current authentication token
   */
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    } catch (error) {
      console.error('Get token error:', error);
      return null;
    }
  }

  /**
   * Save authentication data to storage
   */
  private async saveAuthData(data: AuthResponse): Promise<void> {
    try {
      const { token, user } = data;
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Save auth data error:', error);
      throw error;
    }
  }

  /**
   * Request a password reset for a user's email
   */
  async resetPassword(email: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Password reset request failed');
      }
      
      // No data to return on success
      return;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }
}

// Export as a singleton
export default new AuthService();
