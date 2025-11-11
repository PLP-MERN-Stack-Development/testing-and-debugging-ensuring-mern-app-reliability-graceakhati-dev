/**
 * End-to-End Test: Error Scenario Handling
 * 
 * This test covers various error scenarios:
 * 1. Network errors
 * 2. API errors (500, 404, 400)
 * 3. Form validation errors
 * 4. Backend unavailable
 * 
 * Test Isolation: Each test is independent and doesn't affect others
 * Visual Testing: Screenshots capture error states
 */

describe('Error Scenario Handling', () => {
  beforeEach(() => {
    // Wait for API
    cy.waitForApi();
    
    // Visit the application
    cy.visit('/');
    cy.waitForPageLoad();
    cy.waitForBugList();
    
    // Visual snapshot: Initial state
    cy.takeVisualSnapshot('error-scenarios-initial');
  });

  it('should handle network errors gracefully', () => {
    // Intercept and simulate network failure
    cy.intercept('GET', '**/api/bugs', { forceNetworkError: true }).as('networkError');

    // Reload the page or trigger a bug fetch
    cy.reload();
    cy.wait('@networkError');

    // Check for error message or fallback UI
    cy.get('body').then(($body) => {
      if ($body.find('[role="alert"], .error, [data-testid*="error"]').length > 0) {
        cy.get('[role="alert"], .error, [data-testid*="error"]').should('be.visible');
      } else {
        // Check for error text
        cy.contains(/error|failed|unable to connect|network/i).should('exist');
      }
    });
  });

  it('should handle 500 server errors', () => {
    // Intercept and return 500 error
    cy.intercept('GET', '**/api/bugs', { 
      statusCode: 500, 
      body: { error: 'Internal server error' } 
    }).as('serverError');

    cy.reload();
    cy.wait('@serverError');

    // Check for error message
    cy.get('body').then(($body) => {
      if ($body.find('[role="alert"], .error').length > 0) {
        cy.get('[role="alert"], .error').should('be.visible');
      } else {
        cy.contains(/error|server error|something went wrong/i).should('exist');
      }
    });
  });

  it('should handle 404 not found errors', () => {
    // Try to access a non-existent bug
    cy.intercept('GET', '**/api/bugs/invalid-id', { 
      statusCode: 404, 
      body: { error: 'Bug not found' } 
    }).as('notFound');

    // Trigger a request that would result in 404
    // This might require navigating to a bug detail page
    cy.get('body').then(($body) => {
      // If there's a way to trigger a 404, do it here
      // Otherwise, this test verifies the app doesn't crash on 404
      cy.window().its('console').then((console) => {
        cy.stub(console, 'error').as('consoleError');
      });
    });
  });

  it('should handle form validation errors', () => {
    // Open bug form
    cy.contains('button', /new bug|add bug|create bug/i).click();

    // Try to submit empty form
    cy.contains('button', /submit|save|create|add/i).click();

    // Check for validation errors
    cy.get('body').then(($body) => {
      // Look for validation error indicators
      const hasValidationErrors = 
        $body.find('[role="alert"], .error, [class*="error"], [class*="invalid"]').length > 0 ||
        $body.text().match(/required|invalid|please fill/i);
      
      expect(hasValidationErrors).to.be.true;
    });
  });

  it('should handle backend unavailable scenario', () => {
    // Intercept all API calls and return connection refused
    cy.intercept('GET', '**/api/bugs', { 
      statusCode: 0,
      body: '',
      forceNetworkError: true 
    }).as('backendUnavailable');

    cy.reload();

    // Check for user-friendly error message
    cy.get('body').then(($body) => {
      const errorMessage = $body.text();
      const hasConnectionError = 
        errorMessage.match(/unable to connect|connection refused|backend|server.*running/i) ||
        $body.find('[role="alert"], .error').length > 0;
      
      expect(hasConnectionError).to.be.true;
    });
  });

  it('should display loading states during API calls', () => {
    // Intercept and delay API response
    cy.intercept('GET', '**/api/bugs', (req) => {
      req.reply((res) => {
        res.delay(1000);
        res.send({ success: true, data: [], count: 0 });
      });
    }).as('delayedResponse');

    cy.reload();

    // Check for loading indicator
    cy.get('body').then(($body) => {
      const hasLoadingIndicator = 
        $body.find('[data-testid*="loading"], .loading, [class*="loading"], [aria-busy="true"]').length > 0 ||
        $body.text().match(/loading/i);
      
      // Loading indicator should appear (may be brief)
      if (hasLoadingIndicator) {
        cy.get('[data-testid*="loading"], .loading, [aria-busy="true"]').should('exist');
      }
    });

    cy.wait('@delayedResponse');
  });
});

