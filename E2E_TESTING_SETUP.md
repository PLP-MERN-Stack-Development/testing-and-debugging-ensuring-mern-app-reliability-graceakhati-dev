# End-to-End Testing Setup with Cypress

This document describes the complete E2E testing setup for the MERN Bug Tracker application using Cypress.

## ✅ Setup Complete

### Configuration Files

1. **`cypress.config.js`** - Main Cypress configuration
   - Headless mode support for CI
   - Visual testing with screenshots
   - Video recording for debugging
   - Retry logic for flaky tests
   - Test isolation enabled
   - Custom timeouts for reliability

2. **`cypress/support/e2e.js`** - E2E support file
   - Global test setup
   - Command log customization

3. **`cypress/support/commands.js`** - Custom Cypress commands
   - `waitForApi()` - Wait for backend to be ready
   - `createBugViaApi()` - Create bugs via API for test setup
   - `deleteBugViaApi()` - Delete bugs for cleanup
   - `getBugsViaApi()` - Get bugs via API
   - `clearAllBugs()` - Clear all bugs for test isolation
   - `takeVisualSnapshot()` - Take visual screenshots
   - `waitForPageLoad()` - Wait for page to fully load
   - `waitForBugList()` - Wait for bug list to appear

## 📋 Test Suites

### 1. Complete Bug Reporting Flow (`cypress/e2e/bug-reporting.cy.js`)

**Coverage:**
- ✅ Successfully create a new bug report
- ✅ Validate required fields
- ✅ Display error message when API fails

**Features:**
- Test isolation: Clears bugs before each test
- Visual testing: Screenshots at key points
- API verification: Confirms bug creation via API

### 2. Bug Status Update Workflow (`cypress/e2e/bug-status-update.cy.js`)

**Coverage:**
- ✅ Update bug status from open to in-progress
- ✅ Update bug status to resolved

**Features:**
- Test isolation: Creates fresh bug for each test
- Visual testing: Screenshots capture status changes
- API verification: Confirms status change via API

### 3. Bug Deletion Process (`cypress/e2e/bug-deletion.cy.js`)

**Coverage:**
- ✅ Successfully delete a bug
- ✅ Cancel deletion when cancel is clicked
- ✅ Handle deletion errors gracefully

**Features:**
- Test isolation: Creates and deletes its own bug
- Visual testing: Screenshots capture deletion process
- API verification: Confirms deletion via API

### 4. Error Scenario Handling (`cypress/e2e/error-scenarios.cy.js`)

**Coverage:**
- ✅ Handle network errors gracefully
- ✅ Handle 500 server errors
- ✅ Handle 404 not found errors
- ✅ Handle form validation errors
- ✅ Handle backend unavailable scenario
- ✅ Display loading states during API calls

**Features:**
- Error state verification
- Visual testing: Screenshots capture error states
- Network interception for error simulation

## 🚀 Running E2E Tests

### Prerequisites

1. **Start the backend server:**
   ```bash
   npm run dev:server
   # Server should be running on http://localhost:5000
   ```

2. **Start the frontend:**
   ```bash
   npm run dev:client
   # Frontend should be running on http://localhost:3001
   ```

### Run Tests

#### Headless Mode (CI/Command Line)
```bash
# Run all E2E tests in headless mode
npm run test:e2e:headless

# Or using Cypress directly
npx cypress run
```

#### Interactive Mode (Development)
```bash
# Open Cypress Test Runner
npm run test:e2e:open

# Or using Cypress directly
npx cypress open
```

#### Run Specific Test File
```bash
# Run a specific test file
npx cypress run --spec "cypress/e2e/bug-reporting.cy.js"
```

#### Run All Tests (Unit + Integration + E2E)
```bash
npm run test:all
```

## 🎯 Test Features

### 1. Headless Mode for CI

**Configuration:**
- `cypress.config.js` includes headless mode settings
- Retry logic: 2 retries in headless mode for flaky tests
- Video recording enabled for debugging failures

**Usage:**
```bash
# Runs in headless mode automatically
npm run test:e2e:headless
```

### 2. Test Independence and Reliability

**Features:**
- **Test Isolation**: Each test creates its own data and cleans up
- **Custom Commands**: Reusable commands for common operations
- **Proper Waits**: Uses `waitForPageLoad()` and `waitForBugList()` for reliability
- **API Verification**: Tests verify both UI and API state
- **Retry Logic**: Automatic retries for flaky tests in CI

**Example:**
```javascript
beforeEach(() => {
  // Each test starts with a clean state
  cy.clearAllBugs();
  cy.visit('/');
  cy.waitForPageLoad();
});
```

### 3. Main User Journeys Covered

✅ **Complete Bug Reporting Flow**
- Form submission
- Validation
- Success confirmation

✅ **Bug Status Update Workflow**
- Status transitions
- UI updates
- API synchronization

✅ **Bug Deletion Process**
- Deletion confirmation
- UI updates
- API cleanup

✅ **Error Scenario Handling**
- Network errors
- API errors
- Validation errors
- Backend unavailable

### 4. Visual Testing

**Screenshots:**
- Automatic screenshots on test failure
- Manual screenshots at key points using `cy.takeVisualSnapshot()`
- Screenshots saved to `cypress/screenshots/`

**Video Recording:**
- Videos recorded for all test runs
- Saved to `cypress/videos/`
- Useful for debugging failures

**Visual Snapshot Command:**
```javascript
// Take a visual snapshot at any point
cy.takeVisualSnapshot('my-test-step');
```

## 📊 Test Results

### Viewing Results

**Headless Mode:**
- Results displayed in terminal
- Screenshots saved on failure
- Videos saved for all runs

**Interactive Mode:**
- Real-time test execution
- Visual feedback
- Debugging tools available

### Screenshots Location
```
cypress/screenshots/
├── bug-reporting.cy.js/
│   ├── bug-reporting-initial-state.png
│   ├── bug-form-opened.png
│   └── bug-created-success.png
└── ...
```

### Videos Location
```
cypress/videos/
├── bug-reporting.cy.js.mp4
├── bug-status-update.cy.js.mp4
└── ...
```

## 🔧 Configuration Details

### Timeouts
- `defaultCommandTimeout`: 15000ms (15 seconds)
- `requestTimeout`: 15000ms
- `responseTimeout`: 15000ms
- `pageLoadTimeout`: 30000ms (30 seconds)

### Viewport
- Width: 1280px
- Height: 720px
- Consistent across all tests for visual testing

### Retry Logic
- **Headless Mode**: 2 retries
- **Interactive Mode**: 0 retries (for faster development)

### Test Isolation
- `testIsolation: true` - Each test gets a fresh state
- Custom cleanup commands ensure no test data pollution

## 🐛 Debugging Failed Tests

### 1. View Screenshots
```bash
# Screenshots are automatically saved on failure
# Location: cypress/screenshots/
```

### 2. View Videos
```bash
# Videos are saved for all test runs
# Location: cypress/videos/
```

### 3. Run in Interactive Mode
```bash
npm run test:e2e:open
# Use Cypress UI to debug step-by-step
```

### 4. Check Console Logs
- Cypress logs all commands
- Network requests are logged
- API responses are visible

## 📝 Best Practices Implemented

1. ✅ **Test Independence**: Each test is self-contained
2. ✅ **Proper Cleanup**: Tests clean up after themselves
3. ✅ **Reliable Waits**: Uses proper wait strategies
4. ✅ **Visual Testing**: Screenshots at key points
5. ✅ **API Verification**: Tests verify both UI and API
6. ✅ **Error Handling**: Tests handle errors gracefully
7. ✅ **CI Ready**: Headless mode configured for CI/CD

## 🚦 CI/CD Integration

### GitHub Actions Example
```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm run install-all
      
      - name: Start backend
        run: npm run dev:server &
      
      - name: Start frontend
        run: npm run dev:client &
      
      - name: Wait for servers
        run: |
          sleep 10
          curl -f http://localhost:5000/api/health || exit 1
          curl -f http://localhost:3001 || exit 1
      
      - name: Run E2E tests
        run: npm run test:e2e:headless
      
      - name: Upload screenshots
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: cypress-screenshots
          path: cypress/screenshots
      
      - name: Upload videos
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: cypress-videos
          path: cypress/videos
```

## ✅ Checklist

- [x] Cypress installed and configured
- [x] Headless mode configured for CI
- [x] Test isolation implemented
- [x] Visual testing with screenshots
- [x] Video recording enabled
- [x] Custom commands created
- [x] All 4 test suites created
- [x] Error scenarios covered
- [x] API verification included
- [x] Proper cleanup implemented
- [x] Documentation complete

## 📚 Additional Resources

- [Cypress Documentation](https://docs.cypress.io/)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Visual Testing Guide](https://docs.cypress.io/guides/tooling/visual-testing)

---

**Status**: ✅ **Complete and Ready for Use**

All E2E tests are set up, configured, and ready to run in both headless (CI) and interactive (development) modes.

