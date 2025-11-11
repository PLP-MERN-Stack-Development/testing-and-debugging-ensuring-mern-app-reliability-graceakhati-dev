/**
 * End-to-End Test: Bug Status Update Workflow
 * 
 * This test covers updating a bug's status:
 * 1. Create a bug via API (setup)
 * 2. View the bug in the list
 * 3. Update the bug status
 * 4. Verify the status change is reflected
 * 
 * Test Isolation: Each test creates its own bug and cleans up
 * Visual Testing: Screenshots capture status changes
 */

describe('Bug Status Update Workflow', () => {
  let testBugId;
  let testBugTitle;

  beforeEach(() => {
    // Wait for API
    cy.waitForApi();
    
    // Create a fresh bug for each test (test isolation)
    testBugTitle = `Status Update Test Bug - ${Date.now()}`;
    cy.createBugViaApi({
      title: testBugTitle,
      description: 'Testing status update workflow',
      priority: 'medium',
      status: 'open',
    }).then((response) => {
      expect(response.status).to.eq(201);
      testBugId = response.body.data?._id || response.body.data?.id || response.body._id;
    });

    // Visit the application
    cy.visit('/');
    cy.waitForPageLoad();
    cy.waitForBugList();
    
    // Visual snapshot: Initial state
    cy.takeVisualSnapshot('status-update-initial');
  });

  afterEach(() => {
    // Clean up: Delete the test bug after each test
    if (testBugId) {
      cy.deleteBugViaApi(testBugId);
    }
  });

  it('should update bug status from open to in-progress', () => {
    // Step 1: Find the bug in the list
    cy.contains(testBugTitle)
      .should('be.visible')
      .scrollIntoView();

    // Visual snapshot: Bug found in list
    cy.takeVisualSnapshot('status-update-bug-found');

    // Step 2: Update status
    cy.get('body').then(($body) => {
      // Try to find direct status update button
      const statusButton = $body.find('button:contains("In Progress"), button[data-status="in-progress"], [data-testid*="status-in-progress"]').first();
      
      if (statusButton.length > 0) {
        cy.wrap(statusButton).click();
      } else {
        // Use edit form approach
        cy.contains(testBugTitle)
          .parents('[data-testid*="bug"], .bug-item, [class*="bug"]')
          .within(() => {
            cy.get('button:contains("Edit"), button[aria-label*="edit" i], [data-testid*="edit"]')
              .first()
              .should('be.visible')
              .click();
          });

        // Visual snapshot: Edit form opened
        cy.takeVisualSnapshot('status-update-edit-form');

        // Update status in edit form
        cy.get('select[name="status"], select[data-testid="status-select"]')
          .should('be.visible')
          .select('in-progress');

        cy.contains('button', /save|update|submit/i)
          .should('be.visible')
          .click();
      }
    });

    // Step 3: Verify status change in UI
    cy.contains(testBugTitle, { timeout: 15000 })
      .parents('[data-testid*="bug"], .bug-item, [class*="bug"]')
      .within(() => {
        cy.contains(/in.?progress|in progress/i, { timeout: 10000 })
          .should('be.visible');
      });

    // Visual snapshot: Status updated
    cy.takeVisualSnapshot('status-update-completed');

    // Step 4: Verify status change via API
    cy.getBugsViaApi().then((response) => {
      expect(response.status).to.eq(200);
      const bugs = response.body.data || response.body;
      const updatedBug = Array.isArray(bugs)
        ? bugs.find(bug => bug._id === testBugId || bug.id === testBugId)
        : null;
      expect(updatedBug).to.exist;
      expect(updatedBug.status).to.eq('in-progress');
    });
  });

  it('should update bug status to resolved', () => {
    // Find and update bug status to resolved
    cy.contains('Status Update Test Bug').should('be.visible');

    cy.get('body').then(($body) => {
      const resolvedButton = $body.find('button:contains("Resolved"), button[data-status="resolved"]').first();
      
      if (resolvedButton.length > 0) {
        cy.wrap(resolvedButton).click();
      } else {
        // Use edit form
        cy.contains('Status Update Test Bug')
          .parents('[data-testid*="bug"], .bug-item, [class*="bug"]')
          .within(() => {
            cy.get('button:contains("Edit"), [data-testid*="edit"]')
              .first()
              .click();
          });

        cy.get('select[name="status"], select[data-testid="status-select"]')
          .select('resolved');

        cy.contains('button', /save|update|submit/i).click();
      }
    });

    // Verify resolved status
    cy.contains('Status Update Test Bug')
      .parents('[data-testid*="bug"], .bug-item, [class*="bug"]')
      .within(() => {
        cy.contains(/resolved/i, { timeout: 10000 }).should('be.visible');
      });
  });
});

