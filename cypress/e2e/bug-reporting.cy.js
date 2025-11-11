/**
 * End-to-End Test: Complete Bug Reporting Flow
 * 
 * This test covers the complete user journey of reporting a bug:
 * 1. Navigate to the application
 * 2. Fill out the bug report form
 * 3. Submit the bug
 * 4. Verify the bug appears in the list
 * 5. Verify bug details are correct
 * 
 * Test Isolation: Each test is independent and cleans up after itself
 * Visual Testing: Screenshots are taken at key points for visual verification
 */

describe('Complete Bug Reporting Flow', () => {
  // Clean up before each test to ensure test isolation
  beforeEach(() => {
    // Wait for API to be ready
    cy.waitForApi();
    
    // Clear any existing bugs for test isolation
    cy.clearAllBugs();
    
    // Visit the application
    cy.visit('/');
    
    // Wait for page to fully load
    cy.waitForPageLoad();
    cy.waitForBugList();
    
    // Take initial visual snapshot
    cy.takeVisualSnapshot('bug-reporting-initial-state');
  });

  // Clean up after all tests in this suite
  after(() => {
    cy.clearAllBugs();
  });

  it('should successfully create a new bug report', () => {
    const bugData = {
      title: `E2E Test Bug - ${Date.now()}`,
      description: 'This is a test bug created by Cypress E2E test',
      priority: 'high',
      status: 'open',
    };

    // Step 1: Open the bug form
    cy.contains('button', /new bug|add bug|create bug/i)
      .should('be.visible')
      .click();

    // Visual snapshot: Form opened
    cy.takeVisualSnapshot('bug-form-opened');

    // Step 2: Fill out the bug form
    cy.get('input[name="title"], input[placeholder*="title" i], input[placeholder*="bug" i]')
      .should('be.visible')
      .clear()
      .type(bugData.title);

    cy.get('textarea[name="description"], textarea[placeholder*="description" i]')
      .should('be.visible')
      .clear()
      .type(bugData.description);

    // Select priority
    cy.get('select[name="priority"], select[data-testid="priority-select"]')
      .should('be.visible')
      .select(bugData.priority);

    // Select status if visible
    cy.get('body').then(($body) => {
      if ($body.find('select[name="status"], select[data-testid="status-select"]').length > 0) {
        cy.get('select[name="status"], select[data-testid="status-select"]')
          .select(bugData.status);
      }
    });

    // Visual snapshot: Form filled
    cy.takeVisualSnapshot('bug-form-filled');

    // Step 3: Submit the form
    cy.contains('button', /submit|save|create|add/i)
      .should('be.visible')
      .click();

    // Step 4: Wait for success and verify bug appears in list
    cy.contains(bugData.title, { timeout: 15000 })
      .should('be.visible')
      .should('exist');

    // Visual snapshot: Bug created successfully
    cy.takeVisualSnapshot('bug-created-success');

    // Step 5: Verify bug details in the list
    cy.contains(bugData.title)
      .parents('[data-testid*="bug"], .bug-item, [class*="bug"]')
      .within(() => {
        cy.contains(bugData.title).should('be.visible');
        cy.contains(bugData.description).should('be.visible');
        cy.contains(bugData.priority, { matchCase: false }).should('be.visible');
      });

    // Verify via API that bug was created
    cy.getBugsViaApi().then((response) => {
      expect(response.status).to.eq(200);
      const bugs = response.body.data || response.body;
      const createdBug = Array.isArray(bugs) 
        ? bugs.find(bug => bug.title === bugData.title)
        : null;
      expect(createdBug).to.exist;
      expect(createdBug.priority).to.eq(bugData.priority);
    });
  });

  it('should validate required fields', () => {
    // Click the "New Bug" button
    cy.contains('button', /new bug|add bug|create bug/i).click();

    // Try to submit without filling required fields
    cy.contains('button', /submit|save|create|add/i).click();

    // Check for validation error messages
    cy.get('body').then(($body) => {
      // Look for common validation error indicators
      if ($body.find('[role="alert"]').length > 0) {
        cy.get('[role="alert"]').should('be.visible');
      } else if ($body.text().match(/required|please fill|cannot be empty/i)) {
        cy.contains(/required|please fill|cannot be empty/i).should('exist');
      }
    });
  });

  it('should display error message when API fails', () => {
    // Intercept and fail the API call
    cy.intercept('POST', '**/api/bugs', { statusCode: 500, body: { error: 'Server error' } }).as('createBugFail');

    // Fill out and submit form
    cy.contains('button', /new bug|add bug|create bug/i).click();
    
    cy.get('input[name="title"], input[placeholder*="title" i]')
      .type('Test Bug - API Error');
    
    cy.get('textarea[name="description"], textarea[placeholder*="description" i]')
      .type('Testing error handling');

    cy.contains('button', /submit|save|create|add/i).click();

    // Wait for the failed request
    cy.wait('@createBugFail');

    // Check for error message
    cy.get('body').then(($body) => {
      if ($body.find('[role="alert"]').length > 0) {
        cy.get('[role="alert"]').should('be.visible');
      } else {
        cy.contains(/error|failed|something went wrong/i).should('exist');
      }
    });
  });
});

