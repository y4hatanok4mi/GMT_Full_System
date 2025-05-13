describe("Landing Page", () => {
  it("should redirect unauthenticated user to signin", () => {
    cy.visit("/");
    cy.url().should("include", "/auth/signin");
  });
});
