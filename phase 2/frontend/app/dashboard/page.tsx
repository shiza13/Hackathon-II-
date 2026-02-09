'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import authService from '../../src/services/auth';
import apiClient from '../../src/services/api-client';
import { removeToken } from '../../src/utils/jwt';

export default function DashboardPage() {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const router = useRouter();

  const fetchUserData = async () => {
    try {
      // This would fetch user-specific data using the API client
      // which automatically includes the JWT token
      const response = await apiClient.get(`/api/users/${user?.id}`);
      setUserData(response.data);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to fetch user data');
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } catch (err) {
        console.error('Error fetching user:', err);
        // If not authenticated, redirect to login
        if (authService.isAuthenticated()) {
          setError('Failed to load user data');
        } else {
          router.push('/auth/login');
        }
      } finally {
        setLoading(false);
      }
    };

    if (authService.isAuthenticated()) {
      fetchUser();
    } else {
      router.push('/auth/login');
    }
  }, [router]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      router.push('/auth/login');
    } catch (err) {
      console.error('Logout error:', err);
      // Even if backend logout fails, clear local token
      removeToken();
      router.push('/auth/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Todo Dashboard</h1>
            </div>
            <div className="flex items-center">
              <div className="mr-4 text-sm text-gray-700">
                Welcome, {user?.email}
              </div>
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">Welcome to your dashboard!</h2>
              <p className="mt-2 text-gray-600">Your user ID: {user?.id}</p>
              <p className="text-gray-600">Email: {user?.email}</p>
              <div className="mt-4">
                <button
                  onClick={() => fetchUserData()}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Fetch User Profile
                </button>
              </div>
              {userData && (
                <div className="mt-4 p-4 bg-gray-100 rounded-md">
                  <h3 className="font-medium text-gray-900">User Profile:</h3>
                  <p>ID: {userData.id}</p>
                  <p>Email: {userData.email}</p>
                  <p>Created: {userData.created_at}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}