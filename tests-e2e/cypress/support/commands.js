// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
// -- This is a parent command --
let LOCAL_STORAGE_MEMORY = {};

Cypress.Commands.add('saveLocalStorageCache', () => {
  Object.keys(localStorage).forEach((key) => {
    LOCAL_STORAGE_MEMORY[key] = localStorage[key];
  });
});

Cypress.Commands.add('restoreLocalStorageCache', () => {
  Object.keys(LOCAL_STORAGE_MEMORY).forEach((key) => {
    localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key]);
  });
});

Cypress.Commands.add('emailLogin', (customerId, loanId, config) => {
  cy.request('POST', `${config.authService}/api/login-tokens`, { customerId, loanId }).then((tokenResponse) => {
    expect(tokenResponse.body).to.have.property('token');
    cy.visit(`${config.baseUrl}/entry?token=${tokenResponse.body.token}`, { failOnStatusCode: false });
    cy.waitForLoad(10);
    cy.skipWalkthrough();
  });
});

Cypress.Commands.add('getTokens', (customerId, loanId, config) => {
  cy.request('POST', `${config.authService}/api/login-tokens`, { customerId, loanId }).then((loginTokenResponse) => {
    expect(loginTokenResponse.body).to.have.property('token');
    cy.request('POST', `${config.authService}/api/refresh-tokens`, { nonce: loginTokenResponse.body.token }).then(
      (refreshTokenResponse) => {
        expect(refreshTokenResponse.body).to.have.property('token');
        cy.request({
          method: 'POST',
          url: `${config.authService}/api/bearer-tokens`,
          headers: { Authorization: `Refresh ${refreshTokenResponse.body.token}` },
        }).then((bearerTokenResponse) => {
          expect(bearerTokenResponse.body).to.have.property('token');
          const tokens = {
            refreshToken: refreshTokenResponse.body.token,
            bearerToken: bearerTokenResponse.body.token,
          };
          return tokens;
        });
      }
    );
  });
});

Cypress.Commands.add('visitPage', (page, config) => {
  cy.visit(`${config.baseUrl}/${page}`, { failOnStatusCode: false });
});

Cypress.Commands.add('waitForLoad', (maxRetries) => {
  cy.wait(500);
  if (maxRetries > 0) {
    // Check if page loaded
    if (Cypress.$('[data-qa=loaded]').length === 0) {
      cy.waitForLoad(maxRetries - 1);
    }
  }
  return;
});

Cypress.Commands.add('skipWalkthrough', () => {
  const skipButton = '[data-qa=walkthroughSkip]';
  // Check if walkthrough is active and skip it
  if (Cypress.$(skipButton).length > 0) {
    cy.get(skipButton).click();
  }
});

// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
