// src/components/Footer.tsx
// Footer component for the application

import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start">
            <p className="text-center text-sm text-muted-foreground md:text-left">
              © {currentYear} Todo App. All rights reserved.
            </p>
          </div>
          <div className="mt-4 flex justify-center space-x-6 md:mt-0 md:justify-end">
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };