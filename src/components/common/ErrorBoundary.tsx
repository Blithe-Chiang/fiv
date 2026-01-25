/**
 * ErrorBoundary - Catch rendering errors and show a fallback UI.
 */

import React from 'react';
import { Button } from './Button';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    errorMessage: '',
  };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error) {
    console.error('Unexpected UI error:', error);
  }

  private handleReset = () => {
    this.setState({ hasError: false, errorMessage: '' });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-lg shadow p-6 text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Something went wrong</h1>
              <p className="text-sm text-gray-600 mt-2">
                {this.state.errorMessage || 'An unexpected error occurred. Please try again.'}
              </p>
            </div>
            <div className="flex justify-center gap-3">
              <Button variant="secondary" onClick={this.handleReset}>
                Try Again
              </Button>
              <Button onClick={() => window.location.reload()}>Reload</Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
