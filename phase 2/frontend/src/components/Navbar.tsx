// src/components/Navbar.tsx
// Navigation bar component for the application

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/Button';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Tasks', href: '/tasks' },
    { name: 'Create Task', href: '/tasks/create' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-primary">
              Todo App
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {isAuthenticated &&
                navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      isActive(link.href)
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="hidden text-sm text-gray-700 md:block">
                  Welcome, {user?.name || user?.email}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => logout()}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button variant="default" size="sm" asChild>
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button - placeholder for mobile implementation */}
          <div className="md:hidden flex items-center">
            {/* Mobile menu button would go here */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export { Navbar };