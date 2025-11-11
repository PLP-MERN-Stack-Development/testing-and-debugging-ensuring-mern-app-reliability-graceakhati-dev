// TestErrorPage.jsx - Page for testing ErrorBoundary (Development only)

import React from 'react';
import ErrorBoundary from './ErrorBoundary';
import ErrorThrower from './ErrorThrower';

/**
 * Test page for ErrorBoundary component
 * Only use in development
 */
const TestErrorPage = () => {
  if (process.env.NODE_ENV === 'production') {
    return <div>Error testing page is only available in development mode.</div>;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Error Boundary Testing Page</h1>
      <p>This page is for testing ErrorBoundary functionality.</p>

      <div style={{ marginTop: '2rem' }}>
        <h2>Test 1: Render Error</h2>
        <ErrorBoundary>
          <ErrorThrower errorType="render" />
        </ErrorBoundary>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2>Test 2: Event Handler Error</h2>
        <ErrorBoundary>
          <ErrorThrower errorType="event" />
        </ErrorBoundary>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2>Test 3: Component with Error</h2>
        <ErrorBoundary message="This component threw an error!">
          <ComponentThatThrows />
        </ErrorBoundary>
      </div>
    </div>
  );
};

// Component that throws an error during render
const ComponentThatThrows = () => {
  throw new Error('This is a test error from ComponentThatThrows!');
};

export default TestErrorPage;






