/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable {
      nextAuthLogin(): Chainable<void>;
    }
  }
  

  Cypress.Commands.add('nextAuthLogin', () => {
    cy.request('http://localhost:3000/api/auth/csrf').then((res) => {
      const csrfToken = res.body.csrfToken;
  
      cy.request({
        method: 'POST',
        url: 'http://localhost:3000/api/auth/callback/credentials',
        form: true,
        body: {
          csrfToken,
          id_no: '098765', // your login identifier
          password: '@Qwer1234',
        },
      }).then((loginRes) => {
        const cookies = loginRes.headers['set-cookie'];
        if (Array.isArray(cookies)) {
          cookies.forEach((cookie) => {
            const cookieName = cookie.split('=')[0];
            const cookieValue = cookie.split(';')[0].split('=')[1];
            cy.setCookie(cookieName.trim(), cookieValue.trim());
          });
        }
      });
    });
  });
  
  