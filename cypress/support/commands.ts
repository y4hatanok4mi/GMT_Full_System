/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    nextAuthLogin(): Chainable<void>;
  }
}

Cypress.Commands.add("nextAuthLogin", () => {
  cy.request("http://localhost:3000/api/auth/csrf").then((res) => {
    const csrfToken = res.body.csrfToken;

    cy.request({
      method: "POST",
      url: "http://localhost:3000/api/auth/callback/credentials",
      form: true,
      body: {
        csrfToken,
        id_no: "098765",
        password: "@Qwer1234",
      },
    }).then((loginRes) => {
      const cookies = loginRes.headers["set-cookie"];
      if (Array.isArray(cookies)) {
        const sessionCookie = cookies.find(
          (cookie) =>
            cookie.includes("next-auth.session-token") ||
            cookie.includes("__Secure-next-auth.session-token")
        );

        if (sessionCookie) {
          const nameMatch = sessionCookie.match(/^([^=]+)=/);
          const valueMatch = sessionCookie.match(/=([^;]+)/);

          if (nameMatch && valueMatch) {
            const name = nameMatch[1].trim();
            const value = valueMatch[1].trim();
            cy.setCookie(name, value);
          }
        }
      }
    });
  });
});
