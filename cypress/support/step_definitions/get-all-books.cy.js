import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

let response;

Given("the API endpoint {string} and user role {string}", (endpoint, role) => {
  if (role === "admin") {
    cy.setBasicAuth("admin", "password");
  } else if (role === "user") {
    cy.setBasicAuth("user", "password");
  } else {
    throw new Error("Unknown role");
  }
  cy.wrap(endpoint).as("apiEndpoint");
});

When("I send a GET request", function () {
  cy.get("@apiEndpoint").then((apiEndpoint) => {
    cy.request({
      method: "GET",
      url: apiEndpoint,
      headers: {
        Authorization: Cypress.env("authHeader"), // Using the header set by setBasicAuth
      },
    }).then((res) => {
      response = res;
    });
  });
});

Then("the response status code should be {int}", (statusCode) => {
  expect(response.status).to.eq(statusCode);
});

Then("the response should contain a list of books", () => {
  expect(response.body).to.be.an("array");
  expect(response.body.length).to.be.greaterThan(-1);
});
