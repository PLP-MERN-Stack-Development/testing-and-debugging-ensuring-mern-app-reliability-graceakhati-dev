/**
 * End-to-End Test: Bug Deletion Process
 * 
 * This test covers deleting a bug:
 * 1. Create a bug via API (setup)
 * 2. Verify bug exists in the list
 * 3. Delete the bug
 * 4. Verify the bug is removed from the list
 * 
 * Test Isolation: Each test creates and deletes its own bug
 * Visual Testing: Screenshots capture deletion process
 */

describe('Bug Deletion Process', () => {
  let testBugId;
  let testBugTitle;

  beforeEach(() => {
    // Wait for API
    cy.waitForApi();
    
    // Create a fresh bug for each test (test isolation)
    testBugTitle = `Delete Test Bug - ${Date.now()}`;
    
    cy.createBugViaApi({
      title: testBugTitle,
      description: 'This bug will be deleted',
      priority: 'low',
      status: 'open',
    }).then((response) => {
      expect(response.status).to.eq(201);
      testBugId = response.body.data?._id || response.body.data?.id || response.body._id;
    });

    // Visit the application
    cy.visit('/');
    cy.waitForPageLoad();
    cy.waitForBugList();
    
    // Visual snapshot: Bug exists before deletion
    cy.takeVisualSnapshot('deletion-bug-exists');
  });

  it('should successfully delete a bug', () => {
    // Step 1: Verify bug exists
    cy.contains(testBugTitle)
      .should('be.visible')
      .scrollIntoView();

    // Visual snapshot: Bug visible before deletion
    cy.takeVisualSnapshot('deletion-before-click');

    // Step 2: Find and click delete button
    cy.contains(testBugTitle)
      .parents('[data-testid*="bug"], .bug-item, [class*="bug"]')
      .within(() => {
        cy.get('button:contains("Delete"), button[aria-label*="delete" i], [data-testid*="delete"]')
          .first()
          .should('be.visible')
          .click();
      });

    // Step 3: Confirm deletion if confirmation dialog appears
    cy.get('body').then(($body) => {
      if ($body.find('[role="dialog"], .modal, [data-testid*="confirm"]').length > 0) {
        // Visual snapshot: Confirmation dialog
        cy.takeVisualSnapshot('deletion-confirmation-dialog');
        cy.contains('button', /confirm|yes|delete/i)
          .should('be.visible')
          .click();
      }
    });

    // Step 4: Verify bug is removed from the list
    cy.contains(testBugTitle, { timeout: 15000 })
      .should('not.exist');

    // Visual snapshot: Bug deleted
    cy.takeVisualSnapshot('deletion-completed');

    // Step 5: Verify deletion via API
    cy.getBugsViaApi().then((response) => {
      expect(response.status).to.eq(200);
      const bugs = response.body.data || response.body;
      const deletedBug = Array.isArray(bugs)
        ? bugs.find(bug => bug._id === testBugId || bug.id === testBugId)
        : null;
      expect(deletedBug).to.not.exist;
    });
  });

  it('should cancel deletion when cancel is clicked', () => {
    // Verify bug exists
    cy.contains(testBugTitle).should('be.visible');

    // Click delete button
    cy.contains(testBugTitle)
      .parents('[data-testid*="bug"], .bug-item, [class*="bug"]')
      .within(() => {
        cy.get('button:contains("Delete"), [data-testid*="delete"]')
          .first()
          .click();
      });

    // Cancel deletion if confirmation dialog appears
    cy.get('body').then(($body) => {
      if ($body.find('[role="dialog"], .modal, [data-testid*="confirm"]').length > 0) {
        cy.contains('button', /cancel|no/i).click();
        
        // Verify bug still exists
        cy.contains(testBugTitle).should('be.visible');
      }
    });
  });

  it('should handle deletion errors gracefully', () => {
    // Intercept and fail the delete API call
    cy.intercept('DELETE', `**/api/bugs/${testBugId}`, { 
      statusCode: 500, 
      body: { error: 'Server error' } 
    }).as('deleteBugFail');

    // Verify bug exists
    cy.contains(testBugTitle).should('be.visible');

    // Click delete button
    cy.contains(testBugTitle)
      .parents('[data-testid*="bug"], .bug-item, [class*="bug"]')
      .within(() => {
        cy.get('button:contains("Delete"), [data-testid*="delete"]')
          .first()
          .click();
      });

    // Confirm deletion
    cy.get('body').then(($body) => {
      if ($body.find('[role="dialog"], .modal').length > 0) {
        cy.contains('button', /confirm|yes|delete/i).click();
      }
    });

    // Wait for failed request
    cy.wait('@deleteBugFail');

    // Check for error message
    cy.get('body').then(($body) => {
      if ($body.find('[role="alert"]').length > 0) {
        cy.get('[role="alert"]').should('be.visible');
      } else {
        cy.contains(/error|failed|something went wrong/i).should('exist');
      }
    });

    // Bug should still exist
    cy.contains(testBugTitle).should('be.visible');
  });
});

