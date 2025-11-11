// ErrorBoundary.jsx - React Error Boundary component

import React from 'react';
import './ErrorBoundary.css';

// Mock error reporting service
const errorReportingService = {
  logError: (error, errorInfo) => {
    // In production, this would send to services like Sentry, LogRocket, etc.
    console.error('🚨 [ERROR REPORTING]', {
      error: error.toString(),
      errorInfo,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    });
    
    // Mock API call to error reporting service
    // In real app: fetch('/api/errors', { method: 'POST', body: JSON.stringify({...}) })
  },
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to error reporting service
    errorReportingService.logError(error, errorInfo);

    // Store error details in state for display
    this.setState({
      error,
      errorInfo,
    });

    // You can also log the error to an error reporting service here
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    // Reset error boundary state
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    // Optionally reload the page or navigate to home
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReset);
      }

      // Default fallback UI
      return (
        <div className="error-boundary">
          <div className="error-boundary-container">
            <div className="error-boundary-icon">⚠️</div>
            <h1 className="error-boundary-title">Something went wrong</h1>
            <p className="error-boundary-message">
              {this.props.message || 
                'We encountered an unexpected error. Please try refreshing the page.'}
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-boundary-details">
                <summary className="error-boundary-summary">
                  Error Details (Development Only)
                </summary>
                <div className="error-boundary-error">
                  <strong>Error:</strong>
                  <pre>{this.state.error.toString()}</pre>
                  {this.state.errorInfo && (
                    <>
                      <strong>Component Stack:</strong>
                      <pre>{this.state.errorInfo.componentStack}</pre>
                    </>
                  )}
                </div>
              </details>
            )}

            <div className="error-boundary-actions">
              <button
                className="btn btn-primary"
                onClick={this.handleReset}
              >
                Try Again
              </button>
              <button
                className="btn btn-secondary"
                onClick={this.handleReload}
              >
                Reload Page
              </button>
            </div>

            {this.props.showHomeButton && (
              <button
                className="btn btn-link"
                onClick={() => (window.location.href = '/')}
              >
                Go to Home
              </button>
            )}
          </div>
        </div>
      );
    }

    // Render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;






