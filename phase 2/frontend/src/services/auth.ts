import apiClient from './api-client';
import { storeToken, removeToken, isTokenValid, getToken } from '../utils/jwt';
import logger from '../utils/logger';

/* =======================
   Types & Interfaces
======================= */

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupData {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  token_type?: string;
  user_id?: string;
  email?: string;
}

interface SignupResponse {
  user_id?: string;
  email?: string;
  access_token?: string; // optional (some backends return it)
  message?: string;
}

interface User {
  id: string;
  email: string;
}

/* =======================
   Validation Helpers
======================= */

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): boolean {
  return password.length >= 6;
}

/* =======================
   Auth Service
======================= */

class AuthService {
  /* ---------- LOGIN ---------- */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    logger.info('Starting login process', { email: credentials.email });

    if (!validateEmail(credentials.email)) {
      throw new Error('Invalid email format');
    }

    if (!validatePassword(credentials.password)) {
      throw new Error('Password must be at least 6 characters');
    }

    try {
      const response = await apiClient.post<LoginResponse>(
        '/auth/login',
        credentials
      );

      if (response.data?.access_token) {
        storeToken(response.data.access_token);
        logger.info('Login successful, token stored');
      } else {
        throw new Error('No access token received from server');
      }

      return response.data;
    } catch (error: any) {
      logger.error('Login failed', {
        error: error.message,
        status: error.response?.status,
      });

      if (error.response?.status === 401) {
        throw new Error('Invalid email or password');
      }

      if (error.response?.status === 422) {
        throw new Error('Invalid input data');
      }

      throw new Error('Login failed. Please try again.');
    }
  }

  /* ---------- SIGNUP ---------- */
  async signup(userData: SignupData): Promise<SignupResponse> {
    logger.info('Starting signup process', { email: userData.email });

    if (!validateEmail(userData.email)) {
      throw new Error('Invalid email format');
    }

    if (!validatePassword(userData.password)) {
      throw new Error('Password must be at least 6 characters');
    }

    try {
      const response = await apiClient.post<SignupResponse>(
        '/auth/signup',
        userData
      );

      // If backend returns token on signup, store it
      if (response.data?.access_token) {
        storeToken(response.data.access_token);
        logger.info('Signup successful, token stored');
      } else {
        logger.info('Signup successful (no token returned)');
      }

      return response.data;
    } catch (error: any) {
      logger.error('Signup failed', {
        error: error.message,
        status: error.response?.status,
      });

      if (
        error.response?.status === 400 &&
        error.response?.data?.detail?.includes('already')
      ) {
        throw new Error('Email already exists');
      }

      if (error.response?.status === 422) {
        throw new Error('Invalid input data');
      }

      throw new Error('Signup failed. Please try again.');
    }
  }

  /* ---------- LOGOUT ---------- */
  async logout(): Promise<void> {
    try {
      // Optional: backend logout (safe if not implemented)
      await apiClient.post('/auth/logout');
    } catch {
      // Ignore backend logout errors
    } finally {
      removeToken();
      logger.info('User logged out');
    }
  }

  /* ---------- CURRENT USER ---------- */
  async getCurrentUser(): Promise<User> {
    const token = getToken();

    if (!token || !isTokenValid(token)) {
      throw new Error('No valid token found');
    }

    try {
      const response = await apiClient.get<User>('/auth/me');
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch current user');
      throw error;
    }
  }

  /* ---------- HELPERS ---------- */
  isAuthenticated(): boolean {
    const token = getToken();
    return Boolean(token && isTokenValid(token));
  }

  getStoredToken(): string | null {
    return getToken();
  }
}

export default new AuthService();
