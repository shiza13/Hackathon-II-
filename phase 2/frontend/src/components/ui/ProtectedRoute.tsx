// src/components/ui/ProtectedRoute.tsx
// Protected route component for the application

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback = null,
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // If user is not authenticated, show fallback or redirect to login
  if (!isAuthenticated) {
    // We can't use router.push here directly in render as it would cause issues
    // Instead, we'll return null or a fallback component
    // The actual redirect would be handled by the AuthContext useEffect

    if (fallback) {
      return <>{fallback}</>;
    }

    // If no fallback is provided, we could render a default unauthorized component
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="rounded-lg bg-red-50 p-6 text-center shadow-md">
          <h2 className="mb-2 text-xl font-bold text-red-800">Access Denied</h2>
          <p className="mb-4 text-red-600">
            You must be logged in to access this page.
          </p>
          <button
            onClick={() => router.push('/auth/login')}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // If user is authenticated, render the protected content
  return <>{children}</>;
};

export { ProtectedRoute };