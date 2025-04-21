describe('Student Page', () => {
  it('should display student info', () => {
    cy.nextAuthLogin().then(() => {
      cy.visit('/student');
      cy.contains('BNHS'); // or use name, school, etc.
    });
  });
});
