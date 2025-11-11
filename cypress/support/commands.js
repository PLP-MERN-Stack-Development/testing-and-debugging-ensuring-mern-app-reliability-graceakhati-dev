// ***********************************************
// Custom Cypress Commands for Bug Tracker E2E Tests
// ***********************************************

// Custom command to wait for API to be ready
Cypress.Commands.add('waitForApi', () => {
  const apiUrl = Cypress.env('apiUrl') || 'http://localhost:5000/api';
  cy.request({
    method: 'GET',
    url: `${apiUrl}/health`,
    failOnStatusCode: false,
    timeout: 10000,
  });
});

// Custom command to create a bug via API (for test setup)
Cypress.Commands.add('createBugViaApi', (bugData) => {
  const apiUrl = Cypress.env('apiUrl') || 'http://localhost:5000/api';
  return cy.request({
    method: 'POST',
    url: `${apiUrl}/bugs`,
    body: bugData,
    headers: {
      'Content-Type': 'application/json',
    },
    failOnStatusCode: false,
  });
});

// Custom command to delete a bug via API (for test cleanup)
Cypress.Commands.add('deleteBugViaApi', (bugId) => {
  const apiUrl = Cypress.env('apiUrl') || 'http://localhost:5000/api';
  return cy.request({
    method: 'DELETE',
    url: `${apiUrl}/bugs/${bugId}`,
    failOnStatusCode: false,
  });
});

// Custom command to get all bugs via API
Cypress.Commands.add('getBugsViaApi', () => {
  const apiUrl = Cypress.env('apiUrl') || 'http://localhost:5000/api';
  return cy.request({
    method: 'GET',
    url: `${apiUrl}/bugs`,
    failOnStatusCode: false,
  });
});

// Custom command to clear all bugs (for test isolation)
Cypress.Commands.add('clearAllBugs', () => {
  const apiUrl = Cypress.env('apiUrl') || 'http://localhost:5000/api';
  cy.getBugsViaApi().then((response) => {
    if (response.body && response.body.data) {
      response.body.data.forEach((bug) => {
        const bugId = bug._id || bug.id;
        if (bugId) {
          cy.deleteBugViaApi(bugId);
        }
      });
    }
  });
});

// Custom command to take visual snapshot (for visual testing)
Cypress.Commands.add('takeVisualSnapshot', (name) => {
  cy.screenshot(name, {
    capture: 'viewport',
    clip: { x: 0, y: 0, width: 1280, height: 720 },
  });
});

// Custom command to wait for page to be fully loaded
Cypress.Commands.add('waitForPageLoad', () => {
  cy.window().its('document.readyState').should('eq', 'complete');
  cy.get('body').should('be.visible');
});

// Custom command to wait for bug list to load
Cypress.Commands.add('waitForBugList', () => {
  cy.get('[data-testid="bug-list"], .bug-list, [class*="bug-list"]', { timeout: 15000 })
    .should('exist')
    .should('be.visible');
});

