# MERN Bug Tracker Application

A full-stack bug tracking application built with MongoDB, Express.js, React, and Node.js, featuring comprehensive testing strategies and debugging techniques.

## Table of Contents

- [Project Overview](#project-overview)
- [Project Setup and Installation](#project-setup-and-installation)
- [Running the Application](#running-the-application)
- [Testing Instructions](#testing-instructions)
- [Debugging Guide](#debugging-guide)
- [Testing Strategy](#testing-strategy)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)

---

## Project Overview

This is a MERN stack application designed to demonstrate best practices in:
- **Testing**: Unit, integration, and end-to-end testing strategies
- **Debugging**: Common MERN stack issues and solutions
- **Code Quality**: High test coverage and maintainable code structure
- **Error Handling**: Comprehensive error boundaries and middleware

### Key Features

- ✅ Create, read, update, and delete bug reports
- ✅ Filter bugs by status, priority, and sort options
- ✅ Real-time error handling and user feedback
- ✅ Comprehensive test coverage (70%+ minimum)
- ✅ Production-ready error boundaries and logging

---

## Project Setup and Installation

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v9.0.0 or higher) - Comes with Node.js
- **MongoDB** (v6.0 or higher) - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)

### Installation Steps

#### 1. Clone the Repository

```bash
git clone <https://github.com/PLP-MERN-Stack-Development/testing-and-debugging-ensuring-mern-app-reliability-graceakhati-dev.git>
cd testing-and-debugging-ensuring-mern-app-reliability-graceakhati-dev
```

#### 2. Install Dependencies

**Option A: Install all dependencies at once (Recommended)**

```bash
npm run install-all
```

This command installs dependencies for:
- Root project
- Client (React frontend)
- Server (Express backend)

**Option B: Install dependencies separately**

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..

# Install server dependencies
cd server
npm install
cd ..
```

#### 3. Environment Configuration

**Backend Environment Variables**

Create a `.env` file in the `server` directory (optional, defaults are provided):

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/bugtracker

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3001
```

**Frontend Environment Variables**

Create a `.env` file in the `client` directory (optional):

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api
```

#### 4. Start MongoDB

**Option A: Local MongoDB**

```bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongod
# or
mongod --dbpath ~/data/db
```

**Option B: MongoDB Atlas (Cloud)**

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster and get your connection string
3. Update `MONGODB_URI` in your `.env` file

#### 5. Verify Installation

```bash
# Check Node.js version
node -v  # Should be v18.0.0 or higher

# Check npm version
npm -v  # Should be v9.0.0 or higher

# Check MongoDB (if installed locally)
mongod --version
```

---

## Running the Application

### Development Mode

#### Running Both Client and Server

**Terminal 1: Start the Backend Server**

```bash
# From root directory
npm run dev:server

# Or from server directory
cd server
npm run dev
```

The server will start on `http://localhost:5000`

**Terminal 2: Start the Frontend Client**

```bash
# From root directory
npm run dev:client

# Or from client directory
cd client
npm start
```

The client will start on `http://localhost:3001` (or next available port)

#### Running with Nodemon (Auto-restart)

The backend uses `nodemon` for automatic server restarts on file changes:

```bash
cd server
npm run dev
```

### Production Mode

#### 1. Build the Frontend

```bash
cd client
npm run build
```

This creates an optimized production build in the `client/build` directory.

#### 2. Set Environment Variables

```bash
# Backend
export NODE_ENV=production
export PORT=5000
export MONGODB_URI=mongodb://your-production-db-uri/bugtracker

# Frontend (before building)
export REACT_APP_API_URL=https://your-api-domain.com/api
```

#### 3. Start the Production Server

```bash
# From root directory
npm start

# Or from server directory
cd server
npm start
```

#### 4. Serve the Frontend (Optional)

You can serve the built React app using:

- **Express static files** (recommended for single-server deployment)
- **Nginx** (recommended for production)
- **Apache**
- **Netlify/Vercel** (for frontend-only deployment)

### Quick Start Scripts

```bash
# Install all dependencies
npm run install-all

# Start backend in development mode
npm run dev:server

# Start frontend in development mode
npm run dev:client

# Start backend in production mode
npm start
```

---

## Testing Instructions

### Test Suite Overview

This project uses **Jest** as the primary testing framework with:
- **React Testing Library** for React component testing
- **Supertest** for API endpoint testing
- **MongoDB Memory Server** for isolated database testing

### Running Tests

#### Run All Tests

```bash
# From root directory
npm test
```

#### Run Tests by Project

```bash
# Client-side tests only
npm run test:client

# Server-side tests only
npm run test:server
```

#### Run Tests by Type

```bash
# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration
```

#### Watch Mode

```bash
# Watch mode for all tests
npm run test:watch

# Watch mode for client tests
cd client
npm run test:watch

# Watch mode for server tests
cd server
npm run test:watch
```

### Test Coverage

#### Generate Coverage Reports

```bash
# All tests with coverage
npm run test:coverage

# Client coverage only
npm run test:coverage:client

# Server coverage only
npm run test:coverage:server
```

#### View Coverage Reports

```bash
# Open HTML coverage report (macOS)
npm run test:coverage:open

# Or manually open
# Coverage reports are in:
# - coverage/index.html (combined)
# - coverage/client/index.html (client only)
# - coverage/server/index.html (server only)
```

#### Coverage Thresholds

The project enforces minimum coverage thresholds:

**Global Thresholds:**
- Statements: 70%
- Branches: 60%
- Functions: 70%
- Lines: 70%

**Critical File Thresholds:**
- **Server Controllers**: 75%
- **Server Middleware**: 80%
- **Server Models**: 75%
- **Client Components**: 75%
- **Client Context**: 75%
- **Client Services**: 80%

### Interpreting Test Results

#### Test Output Format

```
PASS  client/src/tests/unit/BugForm.test.jsx
  BugForm Component
    ✓ renders form fields correctly
    ✓ validates required fields
    ✓ submits form with valid data

PASS  server/tests/integration/bugRoutes.test.js
  Bug API Routes
    ✓ GET /api/bugs returns all bugs
    ✓ POST /api/bugs creates a new bug
    ✓ PUT /api/bugs/:id updates a bug

Test Suites: 2 passed, 2 total
Tests:       15 passed, 15 total
```

#### Understanding Test Failures

**Example Failure:**

```
FAIL  client/src/tests/unit/BugForm.test.jsx
  BugForm Component
    ✕ validates required fields

    expect(getByText(/title is required/i)).toBeInTheDocument()
    
    Expected element to be in document but it wasn't found.
```

**How to Debug:**
1. Check the test file to understand what's being tested
2. Review the component implementation
3. Check console logs in the test output
4. Use `screen.debug()` in your test to see the rendered output

#### Coverage Report Interpretation

**Statement Coverage**: Percentage of code statements executed
- **70%+**: Good coverage
- **80%+**: Excellent coverage
- **<70%**: Needs improvement

**Branch Coverage**: Percentage of conditional branches tested
- Tests both `if` and `else` paths
- Important for error handling

**Function Coverage**: Percentage of functions called
- Ensures all functions are tested

**Line Coverage**: Percentage of lines executed
- Similar to statement coverage

### Writing New Tests

#### Client-Side Unit Test Example

```javascript
// client/src/tests/unit/MyComponent.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MyComponent from '../../components/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('handles user interaction', () => {
    render(<MyComponent />);
    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);
    expect(screen.getByText('Clicked!')).toBeInTheDocument();
  });
});
```

#### Server-Side Unit Test Example

```javascript
// server/tests/unit/myUtils.test.js
const { myUtilityFunction } = require('../../src/utils/myUtils');

describe('myUtilityFunction', () => {
  it('should process input correctly', () => {
    const result = myUtilityFunction('test');
    expect(result).toBe('processed: test');
  });

  it('should handle edge cases', () => {
    expect(() => myUtilityFunction(null)).toThrow();
  });
});
```

#### Integration Test Example

```javascript
// server/tests/integration/bugRoutes.test.js
const request = require('supertest');
const app = require('../../src/app');
const Bug = require('../../src/models/Bug');

describe('Bug API Integration Tests', () => {
  beforeEach(async () => {
    await Bug.deleteMany({});
  });

  it('GET /api/bugs should return all bugs', async () => {
    await Bug.create({
      title: 'Test Bug',
      description: 'Test Description',
      status: 'open',
      priority: 'medium'
    });

    const response = await request(app)
      .get('/api/bugs')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(1);
  });
});
```

#### Test Best Practices

1. **Arrange-Act-Assert Pattern**
   ```javascript
   it('should do something', () => {
     // Arrange: Set up test data
     const input = 'test';
     
     // Act: Execute the function
     const result = myFunction(input);
     
     // Assert: Verify the result
     expect(result).toBe('expected');
   });
   ```

2. **Test Isolation**: Each test should be independent
3. **Descriptive Names**: Use clear, descriptive test names
4. **Test One Thing**: Each test should verify one behavior
5. **Mock External Dependencies**: Use mocks for API calls, databases, etc.

---

## Debugging Guide

### Common Issues and Solutions

#### 1. Backend Connection Refused

**Error:**
```
Failed to load resource: net::ERR_CONNECTION_REFUSED
Error: Unable to connect to the server
```

**Solutions:**
- ✅ Verify backend server is running: `npm run dev:server`
- ✅ Check if port 5000 is available: `netstat -ano | findstr :5000` (Windows) or `lsof -i :5000` (macOS/Linux)
- ✅ Verify MongoDB is running: `mongod --version`
- ✅ Check CORS configuration in `server/src/app.js`
- ✅ Verify API URL in frontend: Check `client/src/services/bugService.js`

#### 2. MongoDB Connection Error

**Error:**
```
Error connecting to MongoDB: connect ECONNREFUSED 127.0.0.1:27017
```

**Solutions:**
- ✅ Start MongoDB service: `mongod` or `sudo systemctl start mongod`
- ✅ Check MongoDB URI in `.env` file
- ✅ Verify MongoDB is listening on port 27017
- ✅ For MongoDB Atlas: Check connection string and network access

#### 3. React Scripts Not Recognized

**Error:**
```
'react-scripts' is not recognized as an internal or external command
```

**Solutions:**
```bash
# Delete node_modules and reinstall
cd client
rm -rf node_modules package-lock.json
npm install

# Or use npm ci for clean install
npm ci
```

#### 4. CORS Errors

**Error:**
```
Access to fetch at 'http://localhost:5000/api/bugs' from origin 'http://localhost:3001' has been blocked by CORS policy
```

**Solutions:**
- ✅ Verify CORS middleware is configured in `server/src/app.js`
- ✅ Check `FRONTEND_URL` environment variable
- ✅ Ensure CORS allows your frontend origin
- ✅ In development, CORS allows all origins by default

#### 5. Test Failures

**Common Causes:**
- Missing test setup files
- Incorrect mock configurations
- Database not properly cleaned between tests
- Async operations not properly awaited

**Solutions:**
- ✅ Check test setup files: `client/src/tests/setup.js` and `server/tests/setup.js`
- ✅ Verify mocks are properly configured
- ✅ Use `beforeEach` and `afterEach` for test cleanup
- ✅ Ensure async operations use `await` or return promises

### Using Chrome DevTools

#### 1. Debugging Frontend Issues

**Open DevTools:**
- Press `F12` or `Ctrl+Shift+I` (Windows/Linux)
- Press `Cmd+Option+I` (macOS)
- Right-click → Inspect

**Key Features:**

**Console Tab:**
```javascript
// View API calls
console.log('[bugService] Fetching bugs from:', url);

// Check for errors
console.error('Error:', error);

// Debug state
console.log('Current bugs:', bugs);
```

**Network Tab:**
- Monitor API requests
- Check request/response headers
- Verify CORS headers
- View response data

**React DevTools:**
- Install [React DevTools Extension](https://reactjs.org/link/react-devtools)
- Inspect component props and state
- Profile component performance
- Debug context providers

**Sources Tab:**
- Set breakpoints
- Step through code
- Inspect variables
- Watch expressions

#### 2. Debugging Backend Issues

**Console Logging:**
```javascript
// In server code
console.log('=== DEBUG: Request Details ===');
console.log('Method:', req.method);
console.log('URL:', req.url);
console.log('Body:', req.body);
```

**Node.js Debugger:**
```bash
# Start server with debugger
node --inspect server/src/server.js

# Or with nodemon
nodemon --inspect server/src/server.js
```

Then open Chrome and navigate to `chrome://inspect`

**VS Code Debugging:**
Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Server",
      "program": "${workspaceFolder}/server/src/server.js",
      "env": {
        "NODE_ENV": "development"
      }
    }
  ]
}
```

### Backend Debugging Techniques

#### 1. Request Logging Middleware

Already implemented in `server/src/app.js`:
```javascript
app.use((req, res, next) => {
  console.log('=== DEBUG: Incoming Request ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Body:', req.body);
  next();
});
```

#### 2. Error Logging

Error logger utility in `server/src/utils/errorLogger.js`:
- Logs application errors
- Logs database errors
- Logs unhandled promise rejections
- Logs uncaught exceptions

#### 3. Database Query Debugging

Enable Mongoose debug mode:
```javascript
// In server/src/config/database.js
mongoose.set('debug', true);
```

#### 4. API Testing with Postman/Insomnia

Test endpoints directly:
- `GET http://localhost:5000/api/bugs`
- `POST http://localhost:5000/api/bugs`
- `GET http://localhost:5000/api/health`

### Frontend Debugging Techniques

#### 1. Error Boundaries

Already implemented in `client/src/components/ErrorBoundary.jsx`:
- Catches React component errors
- Displays user-friendly error messages
- Logs errors to console
- Provides error recovery options

#### 2. Service Layer Logging

Enhanced logging in `client/src/services/bugService.js`:
```javascript
console.log(`[bugService] Fetching bugs from: ${url}`);
console.log(`[bugService] Successfully fetched ${count} bugs`);
```

#### 3. Context Debugging

Use React DevTools to inspect:
- Bug context state
- Loading states
- Error states
- Filter states

#### 4. Network Request Debugging

In Chrome DevTools Network tab:
- Filter by XHR/Fetch
- Check request headers
- Verify response status
- Inspect response data

---

## Testing Strategy

### Why We Chose These Testing Approaches

#### 1. Jest as Primary Framework

**Reasons:**
- ✅ **Zero Configuration**: Works out of the box
- ✅ **Fast Execution**: Parallel test execution
- ✅ **Built-in Coverage**: No additional tools needed
- ✅ **Great Ecosystem**: Extensive plugin support
- ✅ **Snapshot Testing**: Useful for UI regression testing
- ✅ **Mocking**: Powerful mocking capabilities

#### 2. React Testing Library

**Reasons:**
- ✅ **User-Centric**: Tests from user's perspective
- ✅ **Accessibility**: Encourages accessible components
- ✅ **Maintainable**: Less brittle than enzyme
- ✅ **Best Practices**: Aligns with React team recommendations
- ✅ **Simple API**: Easy to learn and use

#### 3. Supertest for API Testing

**Reasons:**
- ✅ **Express Integration**: Works seamlessly with Express
- ✅ **HTTP Assertions**: Easy to test status codes, headers, body
- ✅ **No Server Required**: Tests middleware and routes directly
- ✅ **Fast**: No network overhead

#### 4. MongoDB Memory Server

**Reasons:**
- ✅ **Isolation**: Each test gets a fresh database
- ✅ **Speed**: In-memory database is faster than real MongoDB
- ✅ **No Setup**: No need to install MongoDB for testing
- ✅ **CI/CD Friendly**: Works in any environment

### Test Coverage Goals

#### Minimum Coverage Thresholds

**Global:**
- **Statements**: 70% - Ensures most code paths are tested
- **Branches**: 60% - Tests conditional logic
- **Functions**: 70% - Verifies all functions are called
- **Lines**: 70% - Similar to statements, measures executed lines

**Current Achievement:**
- ✅ **Statements**: 88.01% (Exceeds target by 18%)
- ✅ **Branches**: 79.73% (Exceeds target by 19%)
- ✅ **Functions**: 70.96% (Meets target)
- ✅ **Lines**: 88.11% (Exceeds target by 18%)

**Rationale:**
- **70%** is a practical minimum that catches most bugs
- Higher thresholds (80%+) for critical code (middleware, services)
- Balance between coverage and development speed
- Current coverage exceeds minimum requirements, ensuring high code quality

#### Critical File Thresholds

**Server Middleware (80%):**
- Error handling is critical
- Must handle all error scenarios
- High coverage prevents production bugs

**Client Services (80%):**
- API communication layer
- Must handle all network scenarios
- Critical for user experience

**Controllers & Models (75%):**
- Business logic layer
- Important for data integrity
- Higher than global but not as critical as middleware

### Test Types and Their Purposes

#### Unit Tests

**Purpose:**
- Test individual functions/components in isolation
- Fast execution
- Easy to debug
- High coverage

**Examples:**
- Utility functions
- React components (without API calls)
- Model validation
- Middleware functions

#### Integration Tests

**Purpose:**
- Test how multiple units work together
- Verify API endpoints end-to-end
- Test database interactions
- Ensure components work with services

**Examples:**
- API route handlers with database
- React components with context
- Form submissions with API calls
- Authentication flows

#### End-to-End Tests

**Purpose:**
- Test complete user workflows
- Verify UI interactions
- Test across browsers
- Simulate real user behavior

**Tools:**
- **Cypress** (implemented) - Modern E2E testing framework
- Playwright (alternative)
- Selenium (legacy)

**E2E Test Coverage:**
- ✅ Complete bug reporting flow
- ✅ Bug status update workflow
- ✅ Bug deletion process
- ✅ Error scenario handling (network errors, API errors, validation errors)

**Running E2E Tests:**
```bash
# Run E2E tests in headless mode (CI)
npm run test:e2e:headless

# Open Cypress Test Runner (interactive)
npm run test:e2e:open

# Run all tests (unit + integration + E2E)
npm run test:all
```

**E2E Test Files:**
- `cypress/e2e/bug-reporting.cy.js` - Complete bug creation workflow
- `cypress/e2e/bug-status-update.cy.js` - Status update workflow
- `cypress/e2e/bug-deletion.cy.js` - Deletion process
- `cypress/e2e/error-scenarios.cy.js` - Error handling scenarios

### Continuous Integration Considerations

#### CI/CD Pipeline Setup

**Recommended GitHub Actions Workflow:**

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm run install-all
      
      - name: Run tests
        run: npm run test:ci
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

#### Test Execution in CI

**Optimizations:**
- Use `--maxWorkers=2` to limit parallel execution
- Run tests with `--ci` flag for consistent output
- Generate coverage reports for tracking
- Fail build if coverage drops below threshold

**Current CI Script:**
```bash
npm run test:ci
# Equivalent to: jest --ci --coverage --maxWorkers=2
```

#### Coverage Tracking

**Tools:**
- **Codecov**: Free for open source
- **Coveralls**: Alternative coverage service
- **GitHub Actions**: Built-in coverage reports

**Benefits:**
- Track coverage over time
- Identify coverage gaps
- Enforce coverage requirements
- Generate badges for README

### Testing Best Practices

#### 1. Test Organization

```
tests/
├── unit/           # Fast, isolated tests
├── integration/    # Tests with dependencies
└── e2e/            # Full application tests
```

#### 2. Naming Conventions

- Test files: `*.test.js` or `*.test.jsx`
- Describe blocks: Component/Function name
- Test names: Should describe what is being tested

#### 3. Test Data Management

- Use factories for test data
- Clean up between tests
- Use realistic test data
- Avoid hardcoded values

#### 4. Async Testing

```javascript
// Always await async operations
it('should fetch data', async () => {
  const data = await fetchData();
  expect(data).toBeDefined();
});

// Or return promises
it('should fetch data', () => {
  return fetchData().then(data => {
    expect(data).toBeDefined();
  });
});
```

---

## Project Structure

```
testing-and-debugging-ensuring-mern-app-reliability-graceakhati-dev/
├── client/                          # React frontend
│   ├── public/                      # Static files
│   ├── src/
│   │   ├── components/              # React components
│   │   │   ├── BugForm.jsx         # Bug creation/edit form
│   │   │   ├── BugList.jsx         # Bug list display
│   │   │   ├── BugItem.jsx         # Individual bug item
│   │   │   ├── ErrorBoundary.jsx   # Error boundary component
│   │   │   └── Header.jsx          # App header
│   │   ├── context/                 # React Context
│   │   │   └── BugContext.jsx      # Bug state management
│   │   ├── services/               # API services
│   │   │   └── bugService.js       # Bug API calls
│   │   ├── tests/                   # Test files
│   │   │   ├── unit/               # Unit tests
│   │   │   ├── integration/        # Integration tests
│   │   │   ├── setup.js            # Test setup
│   │   │   └── __mocks__/         # Mock files
│   │   ├── App.jsx                  # Main app component
│   │   └── index.js                 # Entry point
│   └── package.json
│
├── server/                          # Express backend
│   ├── src/
│   │   ├── config/                  # Configuration
│   │   │   └── database.js         # MongoDB connection
│   │   ├── controllers/            # Route controllers
│   │   │   └── bugController.js    # Bug CRUD operations
│   │   ├── middleware/              # Custom middleware
│   │   │   ├── asyncHandler.js     # Async error handler
│   │   │   ├── errorHandler.js     # Global error handler
│   │   │   └── notFound.js         # 404 handler
│   │   ├── models/                  # Mongoose models
│   │   │   └── Bug.js               # Bug model
│   │   ├── routes/                  # API routes
│   │   │   └── bugRoutes.js        # Bug routes
│   │   ├── utils/                   # Utility functions
│   │   │   ├── bugUtils.js         # Bug utilities
│   │   │   ├── dateUtils.js        # Date utilities
│   │   │   └── errorLogger.js      # Error logging
│   │   ├── app.js                   # Express app setup
│   │   └── server.js                # Server entry point
│   ├── tests/                       # Test files
│   │   ├── unit/                    # Unit tests
│   │   ├── integration/            # Integration tests
│   │   └── setup.js                 # Test setup
│   └── package.json
│
├── coverage/                         # Coverage reports (generated)
│   ├── client/                      # Client coverage
│   ├── server/                      # Server coverage
│   └── index.html                   # Combined coverage
│
├── jest.config.js                   # Jest configuration
├── package.json                     # Root package.json
└── README.md                        # This file
```

---

## Troubleshooting

### Common Installation Issues

**Issue: `npm install` fails**
- Solution: Clear npm cache: `npm cache clean --force`
- Try: `npm install --legacy-peer-deps`

**Issue: Permission errors on macOS/Linux**
- Solution: Use `sudo` or fix npm permissions: `npm config set prefix ~/.npm-global`

**Issue: MongoDB connection timeout**
- Solution: Check firewall settings, verify MongoDB is running, check connection string

### Common Runtime Issues

**Issue: Port already in use**
- Solution: Kill process on port: `npx kill-port 5000` or change port in `.env`

**Issue: Module not found errors**
- Solution: Delete `node_modules` and `package-lock.json`, then reinstall

**Issue: Tests fail with "Cannot find module"**
- Solution: Ensure all dependencies are installed, check Jest configuration

### Getting Help

1. Check the error message in the console
2. Review the relevant section in this README
3. Check the test files for examples
4. Review the code comments for guidance
5. Check GitHub issues (if applicable)

---

## Additional Resources

### Documentation
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [MongoDB Testing Best Practices](https://www.mongodb.com/blog/post/mongodb-testing-best-practices) 

### Tools
- [React DevTools](https://reactjs.org/link/react-devtools)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [Postman](https://www.postman.com/) - API testing
- [VS Code Debugger](https://code.visualstudio.com/docs/nodejs/nodejs-debugging)

---

## License

ISC

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new features
4. Ensure all tests pass
5. Submit a pull request

---

**Last Updated**: November 2025
