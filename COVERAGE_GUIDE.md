# 📊 Test Coverage Guide

This guide explains how to generate, interpret, and use test coverage reports.

## 🚀 Running Tests with Coverage

### Basic Commands

```bash
# Run all tests with coverage
npm run test:coverage

# Run client tests with coverage
npm run test:coverage:client

# Run server tests with coverage
npm run test:coverage:server

# Run all tests (without coverage by default)
npm test

# Run client tests only
npm run test:client

# Run server tests only
npm run test:server

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Watch mode (re-runs tests on file changes)
npm run test:watch
```

## 📈 Coverage Report Types

Jest generates multiple coverage report formats:

1. **Text** - Console output (default)
2. **HTML** - Interactive web report (`coverage/index.html`)
3. **LCOV** - For CI/CD integration
4. **JSON** - For programmatic analysis
5. **Clover** - XML format for CI tools

### Viewing HTML Coverage Report

```bash
# Generate and open HTML report
npm run test:coverage:open

# Or manually open
npm run test:coverage
# Then open: coverage/index.html in your browser
```

## 📊 Coverage Metrics Explained

### 1. Statements Coverage
**What it measures:** Percentage of executable statements that were executed.

**Example:**
```javascript
function calculateTotal(items) {
  let total = 0;           // ✓ Executed
  for (let item of items) { // ✓ Executed
    total += item.price;    // ✓ Executed (if items.length > 0)
  }
  return total;            // ✓ Executed
}
```

**Interpretation:**
- 100% = All statements executed
- 70% = 70% of statements executed
- Low coverage = Some code paths not tested

### 2. Branches Coverage
**What it measures:** Percentage of decision branches (if/else, switch cases, ternary operators) that were executed.

**Example:**
```javascript
function getStatus(priority) {
  if (priority === 'high') {    // Branch 1: ✓ Executed
    return 'urgent';
  } else if (priority === 'low') { // Branch 2: ✗ Not executed
    return 'normal';
  } else {                        // Branch 3: ✓ Executed
    return 'medium';
  }
}
```

**Interpretation:**
- 100% = All branches tested
- 60% = Some branches not tested
- Low coverage = Some conditions not covered

### 3. Functions Coverage
**What it measures:** Percentage of functions that were called.

**Example:**
```javascript
function createBug() {     // ✓ Called
  // ...
}

function deleteBug() {    // ✗ Not called
  // ...
}

function updateBug() {    // ✓ Called
  // ...
}
```

**Interpretation:**
- 100% = All functions tested
- 70% = Some functions not tested
- Low coverage = Some functions never called

### 4. Lines Coverage
**What it measures:** Percentage of lines that were executed.

**Example:**
```javascript
function processBug(bug) {
  const title = bug.title;        // Line 1: ✓ Executed
  const description = bug.desc;   // Line 2: ✓ Executed
  if (title.length > 200) {      // Line 3: ✓ Executed
    return false;                 // Line 4: ✗ Not executed
  }
  return true;                    // Line 5: ✓ Executed
}
```

**Interpretation:**
- 100% = All lines executed
- 70% = Some lines not executed
- Low coverage = Some code paths not tested

## 📋 Coverage Thresholds

### Current Thresholds

**Global Thresholds:**
- Statements: 70%
- Branches: 60%
- Functions: 70%
- Lines: 70%

**Server-Side Thresholds:**
- Controllers: 75% (higher for critical business logic)
- Middleware: 80% (higher for error handling)
- Models: 75% (higher for data validation)

**Client-Side Thresholds:**
- Components: 75% (higher for UI components)
- Context: 75% (higher for state management)
- Services: 80% (higher for API calls)

### Why Different Thresholds?

- **Higher thresholds** for critical code (error handling, API calls, state management)
- **Lower thresholds** for less critical code (utilities, helpers)
- **Balanced approach** ensures important code is well-tested

## 📁 Coverage Report Structure

After running `npm run test:coverage`, you'll see:

```
coverage/
├── client/              # Client-side coverage
│   ├── index.html       # HTML report
│   ├── lcov.info        # LCOV format
│   └── coverage-final.json
├── server/              # Server-side coverage
│   ├── index.html       # HTML report
│   ├── lcov.info        # LCOV format
│   └── coverage-final.json
└── index.html           # Combined report
```

## 🔍 Interpreting Coverage Reports

### Console Output Example

```
PASS  server/tests/unit/bugModel.test.js
PASS  client/src/tests/unit/BugForm.test.jsx

----------|---------|----------|---------|---------|-------------------|
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s |
----------|---------|----------|---------|---------|-------------------|
All files |   72.5  |   65.2   |   71.3   |   72.1  |                   |
----------|---------|----------|---------|---------|-------------------|

Test Suites: 10 passed, 10 total
Tests:       150 passed, 150 total
```

**What this tells you:**
- ✅ All tests passed
- ✅ Overall coverage meets thresholds
- 📊 Statements: 72.5% (above 70% threshold)
- 📊 Branches: 65.2% (above 60% threshold)
- 📊 Functions: 71.3% (above 70% threshold)
- 📊 Lines: 72.1% (above 70% threshold)

### HTML Report Navigation

1. **Overview Page:**
   - Summary of all files
   - Overall coverage percentages
   - File-by-file breakdown

2. **File Detail Page:**
   - Line-by-line coverage
   - Green = Covered
   - Red = Not covered
   - Yellow = Partially covered (branches)

3. **Uncovered Lines:**
   - Shows exact line numbers not covered
   - Helps identify what needs testing

## 🎯 Using Coverage to Improve Tests

### Step 1: Generate Coverage Report

```bash
npm run test:coverage
```

### Step 2: Identify Gaps

Look for:
- Files with low coverage (< 70%)
- Uncovered branches (if/else not tested)
- Uncovered functions (functions never called)
- Uncovered lines (code paths not executed)

### Step 3: Write Tests for Gaps

**Example: Finding Uncovered Code**

```javascript
// File: server/src/utils/bugUtils.js
// Coverage: 65% statements

// Uncovered code:
function getPriorityWeight(priority) {
  if (priority === 'critical') return 4;  // ✓ Covered
  if (priority === 'high') return 3;      // ✓ Covered
  if (priority === 'medium') return 2;    // ✗ Not covered
  if (priority === 'low') return 1;       // ✗ Not covered
  return 0;                                // ✗ Not covered
}
```

**Solution:** Add tests for 'medium', 'low', and invalid priority.

### Step 4: Verify Improvement

```bash
# Re-run coverage
npm run test:coverage

# Check if coverage increased
# Target: All files above 70%
```

## 📊 Coverage Best Practices

### 1. Don't Aim for 100%
- 100% coverage doesn't mean bug-free code
- Focus on critical paths and business logic
- 70-80% is usually sufficient

### 2. Focus on Quality Over Quantity
- Better to have fewer, well-written tests
- Test edge cases and error scenarios
- Test user workflows, not just functions

### 3. Use Coverage to Find Gaps
- Coverage shows what's NOT tested
- Use it to identify missing test cases
- Don't write tests just to increase coverage

### 4. Set Realistic Thresholds
- Start with lower thresholds (60-70%)
- Gradually increase as codebase matures
- Different thresholds for different file types

### 5. Review Coverage Regularly
- Check coverage in CI/CD pipeline
- Review coverage reports in code reviews
- Use coverage to guide testing efforts

## 🚨 Common Coverage Issues

### Issue 1: Coverage Below Threshold

**Symptom:**
```
Jest: "Coverage for statements (65.2%) does not meet global threshold (70%)"
```

**Solution:**
1. Identify files with low coverage
2. Write tests for uncovered code
3. Focus on critical files first

### Issue 2: Branches Not Covered

**Symptom:**
```
Branches: 55% (threshold: 60%)
```

**Solution:**
1. Find if/else statements not tested
2. Test both true and false branches
3. Test all switch cases

### Issue 3: Functions Not Called

**Symptom:**
```
Functions: 60% (threshold: 70%)
```

**Solution:**
1. Find functions never called in tests
2. Write tests that call these functions
3. Check if functions are actually needed

## 🔧 Coverage Configuration

### Adjusting Thresholds

Edit `jest.config.js`:

```javascript
coverageThreshold: {
  global: {
    statements: 70,  // Increase to 75, 80, etc.
    branches: 60,    // Increase to 65, 70, etc.
    functions: 70,   // Increase to 75, 80, etc.
    lines: 70,       // Increase to 75, 80, etc.
  },
}
```

### Excluding Files from Coverage

Edit `jest.config.js`:

```javascript
collectCoverageFrom: [
  '**/*.{js,jsx}',
  '!**/node_modules/**',
  '!**/coverage/**',
  '!**/*.config.js',      // Exclude config files
  '!**/tests/**',         // Exclude test files
  '!**/__mocks__/**',     // Exclude mocks
  '!server/src/server.js', // Exclude entry points
],
```

## 📈 Coverage Goals

### Short-term Goals
- ✅ Achieve 70% overall coverage
- ✅ Critical files (controllers, services) above 75%
- ✅ All new code has tests

### Long-term Goals
- 🎯 Increase to 80% overall coverage
- 🎯 Critical files above 85%
- 🎯 Maintain coverage in CI/CD

## 🎓 Example: Improving Coverage

### Before (65% coverage)

```javascript
// bugController.js - 65% coverage
const updateBug = async (req, res, next) => {
  try {
    const bug = await Bug.findByIdAndUpdate(req.params.id, req.body);
    if (!bug) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.json({ success: true, data: bug });
  } catch (error) {
    next(error); // ✗ Not tested
  }
};
```

**Missing Tests:**
- Error handling (catch block)
- Validation errors
- Database errors

### After (85% coverage)

```javascript
// Added tests for:
// - Error handling
// - Validation errors
// - Database connection errors
// - Invalid ID format
```

**Result:** Coverage increased from 65% to 85%

## 📝 Coverage Checklist

- [ ] Run `npm run test:coverage` regularly
- [ ] Review HTML coverage report
- [ ] Identify files below threshold
- [ ] Write tests for uncovered code
- [ ] Focus on critical files first
- [ ] Maintain coverage in CI/CD
- [ ] Update thresholds as codebase grows

---

## 🎯 Quick Reference

```bash
# Generate coverage report
npm run test:coverage

# View HTML report
open coverage/index.html

# Check specific project
npm run test:coverage:client
npm run test:coverage:server

# Run tests without coverage
npm test
```

**Remember:** Coverage is a tool to find gaps, not a goal in itself. Focus on writing meaningful tests that verify your code works correctly!






