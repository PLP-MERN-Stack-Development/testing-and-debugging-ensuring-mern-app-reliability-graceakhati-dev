// jest.config.js - Root Jest configuration file

module.exports = {
  // Base configuration for all tests
  projects: [
    // Server-side tests configuration
    {
      displayName: 'server',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/server/tests/**/*.test.js'],
      moduleFileExtensions: ['js', 'json', 'node'],
      setupFilesAfterEnv: ['<rootDir>/server/tests/setup.js'],
      coverageDirectory: '<rootDir>/coverage/server',
      collectCoverageFrom: [
        'server/src/**/*.js',
        '!server/src/config/**',
        '!server/src/server.js', // Exclude server entry point
        '!**/node_modules/**',
      ],
      coverageThreshold: {
        global: {
          statements: 70,
          branches: 60,
          functions: 70,
          lines: 70,
        },
        // Per-file thresholds for critical files
        './server/src/controllers/**/*.js': {
          statements: 75,
          branches: 65,
          functions: 75,
          lines: 75,
        },
        './server/src/middleware/**/*.js': {
          statements: 80,
          branches: 70,
          functions: 80,
          lines: 80,
        },
        './server/src/models/**/*.js': {
          statements: 75,
          branches: 65,
          functions: 75,
          lines: 75,
        },
      },
      testTimeout: 15000, // Increased for integration tests
      verbose: true,
      maxWorkers: process.env.CI ? '50%' : '75%', // Optimize parallel execution
    },
    
    // Client-side tests configuration
    {
      displayName: 'client',
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/client/src/**/*.test.{js,jsx}'],
      moduleFileExtensions: ['js', 'jsx', 'json'],
      moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/client/src/tests/__mocks__/fileMock.js',
      },
      setupFilesAfterEnv: ['<rootDir>/client/src/tests/setup.js'],
      transform: {
        '^.+\\.(js|jsx)$': 'babel-jest',
      },
      coverageDirectory: '<rootDir>/coverage/client',
      collectCoverageFrom: [
        'client/src/**/*.{js,jsx}',
        '!client/src/index.js',
        '!client/src/tests/**',
        '!client/src/**/*.test.{js,jsx}',
        '!**/node_modules/**',
      ],
      coverageThreshold: {
        global: {
          statements: 70,
          branches: 60,
          functions: 70,
          lines: 70,
        },
        // Per-file thresholds for critical files
        './client/src/components/**/*.{js,jsx}': {
          statements: 75,
          branches: 65,
          functions: 75,
          lines: 75,
        },
        './client/src/context/**/*.{js,jsx}': {
          statements: 75,
          branches: 65,
          functions: 75,
          lines: 75,
        },
        './client/src/services/**/*.{js,jsx}': {
          statements: 80,
          branches: 70,
          functions: 80,
          lines: 80,
        },
      },
      testTimeout: 15000, // Increased for integration tests
      verbose: true,
      maxWorkers: process.env.CI ? '50%' : '75%', // Optimize parallel execution
    },
  ],
  
  // Global configuration
  verbose: true,
  // Don't collect coverage by default (use --coverage flag)
  collectCoverage: false,
  coverageReporters: ['text', 'text-summary', 'lcov', 'clover', 'html', 'json'],
  // Global coverage thresholds (applied when collectCoverage is true)
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 60,
      functions: 70,
      lines: 70,
    },
  },
  testTimeout: 10000,
  // Clear mocks between tests
  clearMocks: true,
  // Reset mocks between tests
  resetMocks: true,
  // Restore mocks between tests
  restoreMocks: true,
  // Coverage collection options
  collectCoverageFrom: [
    '**/*.{js,jsx}',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/*.config.js',
    '!**/tests/**',
    '!**/__mocks__/**',
  ],
}; 