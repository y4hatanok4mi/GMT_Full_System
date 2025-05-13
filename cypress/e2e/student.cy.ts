describe('Student Page', () => {
  it('should display student info', () => {
    cy.nextAuthLogin().then(() => {
      cy.visit('/');
    });
  });
});

describe('Interactive Tool Page', () => {
  it('should display interactive tool', () => {
    cy.nextAuthLogin().then(() => {
      cy.visit('/student/tools/area_start/area');
    });
  });
});

describe('Module Page', () => {
  it('should display Module Overview', () => {
    cy.nextAuthLogin().then(() => {
      const moduleId = Cypress.env('MODULE_ID');
      cy.log(`Visiting module: ${moduleId}`);
      cy.visit(`/student/modules/${moduleId}/overview`);
      cy.url().should('include', `/student/modules/${moduleId}/overview`);
    });
  });
});

describe('Lesson Page', () => {
  it('should display Lesson content', () => {
    cy.nextAuthLogin().then(() => {
      const moduleId = Cypress.env('MODULE_ID');
      const lessonId = Cypress.env('LESSON_ID');
      cy.log(`Visiting module: ${moduleId}`);
      cy.log(`Visiting lesson: ${lessonId}`);
      cy.visit(`/student/modules/${moduleId}/lessons/${lessonId}/chapters`);
      cy.url().should('include', `/student/modules/${moduleId}/lessons/${lessonId}/chapters`);
    });
  });
});

describe('Leaderboard Page', () => {
  it('should display leaderboard', () => {
    cy.nextAuthLogin().then(() => {
      cy.visit('/student/leaderboard');
    });
  });
});

describe('Profile Page', () => {
  it('should display student info', () => {
    cy.nextAuthLogin().then(() => {
      cy.visit('/student/profile');
    });
  });
});

describe('Settings Page', () => {
  it('should display settings page', () => {
    cy.nextAuthLogin().then(() => {
      cy.visit('/student/settings');
    });
  });
});