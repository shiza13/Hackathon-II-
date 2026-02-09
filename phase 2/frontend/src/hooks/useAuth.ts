// src/hooks/useAuth.ts
// Custom hook for authentication state management

import { useState, useEffect } from 'react';
import { getAuthToken, getStoredUser, clearAuthStorage, isTokenExpired } from '../lib/auth';

interface UseAuthReturn {
  user: any;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedToken = getAuthToken();
    const storedUser = getStoredUser();

    if (storedToken && storedUser && !isTokenExpired(storedToken)) {
      setToken(storedToken);
      setUser(storedUser);
    }

    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Login failed');
      }

      const data = await response.json();

      // Store token and user data
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setToken(data.token);
      setUser(data.user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Signup function
  const signup = async (email: string, password: string, name?: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Registration failed');
      }

      const data = await response.json();

      // Store token and user data
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setToken(data.token);
      setUser(data.user);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    clearAuthStorage();
    setToken(null);
    setUser(null);
  };

  return {
    user,
    token,
    isAuthenticated: !!token && !isTokenExpired(token),
    isLoading,
    login,
    signup,
    logout,
  };
};