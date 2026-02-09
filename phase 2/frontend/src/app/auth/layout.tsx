// src/app/auth/layout.tsx
// Layout for authentication pages

import React from 'react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <div className="flex flex-grow items-center justify-center bg-muted p-4">
        <div className="w-full max-w-md rounded-lg bg-background p-8 shadow-lg">
          {children}
        </div>
      </div>

      <Footer />
    </div>
  );
}