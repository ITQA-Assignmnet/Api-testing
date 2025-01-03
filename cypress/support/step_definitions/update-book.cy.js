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
        Authorization: Cypress.env("authHeader"), // Using the header set by setBasicAuth
      },
      body: data,
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
    const expectedId = parseInt(expectedData.id, expectedData.id);
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