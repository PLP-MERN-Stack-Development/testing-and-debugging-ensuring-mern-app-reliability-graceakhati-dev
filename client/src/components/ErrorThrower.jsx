// ErrorThrower.jsx - Test component that throws errors (for testing ErrorBoundary)

import React, { useState } from 'react';

/**
 * Component for testing ErrorBoundary
 * Use with caution - only for development/testing
 */
const ErrorThrower = ({ errorType = 'render' }) => {
  const [shouldThrow, setShouldThrow] = useState(false);

  // Throw error during render
  if (shouldThrow && errorType === 'render') {
    throw new Error('Test error thrown during render!');
  }

  // Throw error in event handler
  const handleClick = () => {
    if (errorType === 'event') {
      throw new Error('Test error thrown in event handler!');
    } else {
      setShouldThrow(true);
    }
  };

  // Throw async error
  const handleAsyncError = async () => {
    if (errorType === 'async') {
      // Note: ErrorBoundary doesn't catch async errors
      // This is just for demonstration
      setTimeout(() => {
        throw new Error('Test async error!');
      }, 100);
    }
  };

  return (
    <div style={{ padding: '1rem', border: '2px dashed #ff6b6b', margin: '1rem' }}>
      <h3>Error Thrower (Testing Component)</h3>
      <p>This component is used to test ErrorBoundary functionality.</p>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button onClick={handleClick}>
          Throw Render Error
        </button>
        <button onClick={handleAsyncError}>
          Throw Async Error
        </button>
        <button
          onClick={() => {
            throw new Error('Test error in event handler!');
          }}
        >
          Throw Event Error
        </button>
      </div>
    </div>
  );
};

export default ErrorThrower;






