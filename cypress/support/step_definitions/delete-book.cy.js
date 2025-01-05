import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

let response;

Given("The Delete API request {string} and user role {string}", (endpoint, role) => {
  if (role === "admin") {
    cy.setBasicAuth("admin", "password");
  } else if (role === "user") {
    cy.setBasicAuth("user", "password");
  } else {
    throw new Error("Unknown role");
  }
  cy.wrap(endpoint).as("apiEndpoint");
});


When("I send DELETE request", () => {
  cy.get("@apiEndpoint").then((apiEndpoint) => {
    cy.request({
      method: "DELETE",
      url: apiEndpoint,
      headers: {
        Authorization: Cypress.env("authHeader"), // Using the header set by setBasicAuth
      },
      failOnStatusCode: false,
    }).then((res) => {
      response = res;
    });
  });
});

Then("The response status must be {int}", (statusCode) => {
  expect(response.status).to.eq(statusCode);
});
    

