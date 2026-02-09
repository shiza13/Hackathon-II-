// src/components/ErrorBoundary.tsx
// Error boundary component for the application

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error | null }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: undefined };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultFallback;
      return <FallbackComponent error={this.state.error || null} />;
    }

    return this.props.children;
  }
}

const DefaultFallback: React.FC<{ error: Error | null }> = ({ error }) => (
  <div className="flex min-h-screen flex-col items-center justify-center p-4">
    <div className="rounded-lg bg-red-50 p-6 text-center shadow-md">
      <h2 className="mb-2 text-xl font-bold text-red-800">Something went wrong</h2>
      {error && <p className="mb-4 text-red-600">{error.message}</p>}
      <button
        onClick={() => window.location.reload()}
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Reload Page
      </button>
    </div>
  </div>
);

export default ErrorBoundary;