import Signup from "./Signup";

describe("Signup", () => {
  it("has visible username, email and password input fields", () => {
    cy.mount(<Signup />);

    cy.get('[data-cy="signup-username"]').should("be.visible");
    cy.get('[data-cy="signup-email"]').should("be.visible");
    cy.get('[data-cy="signup-password"]').should("be.visible");
    cy.get('[data-cy="signup-submit"]').should("be.visible");
  });

  it("sends a valid request when submitting the form", () => {
    cy.intercept("Post", "/api/users", {
      statusCode: 201,
      body: { message: "User created" },
    }).as("signupRequest");

    cy.mount(<Signup />);

    cy.get('[data-cy="signup-username"]').type("fakeUsername");
    cy.get('[data-cy="signup-email"]').type("test@test.com");
    cy.get('[data-cy="signup-password"]').type("1234Password1234");
    cy.get('[data-cy="signup-submit"]').click();

    cy.wait("@signupRequest").then((interception) => {
      expect(interception.request.body.username).to.equal("fakeUsername");
      expect(interception.request.body.email).to.equal("test@test.com");
      expect(interception.request.body.password).to.equal("1234Password1234");
    });
  });
});
