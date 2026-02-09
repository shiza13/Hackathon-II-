// src/app/auth/login/page.tsx
// Login page for the application

'use client';

import React from 'react';
import Link from 'next/link';
import { LoginForm } from '../../../components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to access your account
        </p>
      </div>

      <LoginForm />

      <div className="mt-4 text-center text-sm">
        Don't have an account?{' '}
        <Link href="/auth/signup" className="font-medium text-primary hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
}