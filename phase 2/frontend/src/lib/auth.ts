// src/lib/auth.ts
// Authentication utilities for the application

/**
 * Checks if a JWT token is expired
 * @param token - JWT token string
 * @returns boolean indicating if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true; // If we can't decode it, treat as expired
  }
};

/**
 * Gets the user data from a JWT token
 * @param token - JWT token string
 * @returns User object or null if invalid
 */
export const getUserFromToken = (token: string) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.userId || payload.sub,
      email: payload.email,
      name: payload.name,
      exp: payload.exp
    };
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Stores authentication token in localStorage
 * @param token - JWT token string
 */
export const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

/**
 * Gets authentication token from localStorage
 * @returns Token string or null if not found/expired
 */
export const getAuthToken = (): string | null => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    return null;
  }

  if (isTokenExpired(token)) {
    localStorage.removeItem('authToken');
    return null;
  }

  return token;
};

/**
 * Removes authentication token from localStorage
 */
export const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
};

/**
 * Stores user data in localStorage
 * @param user - User object to store
 */
export const setStoredUser = (user: any): void => {
  localStorage.setItem('user', JSON.stringify(user));
};

/**
 * Gets user data from localStorage
 * @returns User object or null if not found
 */
export const getStoredUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    return null;
  }

  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error parsing stored user:', error);
    return null;
  }
};

/**
 * Removes user data from localStorage
 */
export const removeStoredUser = (): void => {
  localStorage.removeItem('user');
};

/**
 * Clears all authentication data from localStorage
 */
export const clearAuthStorage = (): void => {
  removeAuthToken();
  removeStoredUser();
};