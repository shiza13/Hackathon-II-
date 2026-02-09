// src/app/layout.tsx
// Root layout for the application

import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import ErrorBoundary from '../components/ErrorBoundary';
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Todo App',
  description: 'A modern todo application with authentication and task management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          <AuthProvider>
            <div className="flex min-h-screen flex-col">
              {/* Main content */}
              <main className="flex-grow">
                {children}
              </main>
            </div>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}