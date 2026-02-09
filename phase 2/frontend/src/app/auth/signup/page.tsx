// src/app/auth/signup/page.tsx
// Signup page for the application

'use client';

import React from 'react';
import Link from 'next/link';
import { SignupForm } from '../../../components/auth/SignupForm';

export default function SignupPage() {
  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
        <p className="text-sm text-muted-foreground">
          Enter your details to create an account
        </p>
      </div>

      <SignupForm />

      <div className="mt-4 text-center text-sm">
        Already have an account?{' '}
        <Link href="/auth/login" className="font-medium text-primary hover:underline">
          Log in
        </Link>
      </div>
    </div>
  );
}