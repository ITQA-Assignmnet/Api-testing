import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

let response;

Given("The API request {string} and user role {string}", (endpoint, role) => {
  if (role === "admin") {
    cy.setBasicAuth("admin", "password");
  } else if (role === "user") {
    cy.setBasicAuth("user", "password");
  } else {
    throw new Error("Unknown role");
  }
  cy.wrap(endpoint).as("apiEndpoint");
});

When("I send PUT request with below data:", (dataTable) => {
  const data = dataTable.rowsHash();
  cy.get("@apiEndpoint").then((apiEndpoint) => {
    cy.request({
      method: "PUT",
      url: apiEndpoint,
      headers: {
        Authorization: Cypress.env("authHeader"), 
      },
      body: data,
      failOnStatusCode: false,
    }).then((res) => {
      response = res;
    });
  });
});

When("I send a PUT request with an empty body", () => {
  cy.get("@apiEndpoint").then((apiEndpoint) => {
    cy.request({
      method: "POST",
      url: apiEndpoint,
      headers: {
        Authorization: Cypress.env("authHeader"),
      },
      failOnStatusCode: false, 
      body: {},
    }).then((res) => {
      response = res;
    });
  });
});

Then("The response should contain a updated book:", function (dataTable) {
  const expectedData = dataTable.rowsHash();
  console.log("Response body:", response.body);
  console.log("Expected data:", expectedData);

  if (response.status === 200) {
      // Validate the response contains the expected title and author
    const expectedId = parseInt(expectedData.id, 10);
    expect(response.body).to.have.property("id", expectedId);
    expect(response.body).to.have.property("title", expectedData.title);
    expect(response.body).to.have.property("author", expectedData.author);
  } else if (response.status === 208) {
    // Failure case: validate the error message
    expect(response.body).to.equal("Book Already Exists");
  } else {
    // Unexpected response
    throw new Error(`Unexpected status code: ${response.status}`);
  }
});

Then("The response code should be {int}", (statusCode) => {
  expect(response.status).to.eq(statusCode);
});

Then("The response message should be {string}", (message) => {
  expect(response.body).to.eq(message);
});