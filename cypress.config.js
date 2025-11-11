const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3001',
    setupNodeEvents(on, config) {
      // implement node event listeners here
      // Enable visual testing with screenshots
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
      });
    },
    // Viewport settings for consistent visual testing
    viewportWidth: 1280,
    viewportHeight: 720,
    // Video recording for debugging (useful in CI)
    video: true,
    videoCompression: 32,
    // Screenshots on failure and for visual testing
    screenshotOnRunFailure: true,
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    // Timeouts for reliable test execution
    defaultCommandTimeout: 15000,
    requestTimeout: 15000,
    responseTimeout: 15000,
    pageLoadTimeout: 30000,
    // Test file patterns
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
    // Retry failed tests (useful for flaky tests)
    retries: {
      runMode: 2, // Retry 2 times in CI/headless mode
      openMode: 0, // No retries in interactive mode
    },
    // Test isolation - each test gets a fresh state
    testIsolation: true,
    // Chrome-specific settings for headless mode
    chromeWebSecurity: true,
    // Environment variables
    env: {
      apiUrl: 'http://localhost:5000/api',
    },
  },
  component: {
    devServer: {
      framework: 'create-react-app',
      bundler: 'webpack',
    },
  },
});

