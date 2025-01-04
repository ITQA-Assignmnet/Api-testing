import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

let response;

Given("The API endpoint {string} and user role {string}", (endpoint, role) => {
  if (role === "admin") {
    cy.setBasicAuth("admin", "password");
  } else if (role === "user") {
    cy.setBasicAuth("user", "password");
  } else {
    throw new Error("Unknown role");
  }
  cy.wrap(endpoint).as("apiEndpoint");
});

//secnario 2
When("I send a POST request with the following data:", (dataTable) => {
  const data = dataTable.rowsHash();
  cy.get("@apiEndpoint").then((apiEndpoint) => {
    cy.request({
      method: "POST",
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

When("I send a POST request with an empty body", () => {
  cy.get("@apiEndpoint").then((apiEndpoint) => {
    cy.request({
      method: "POST",
      url: apiEndpoint,
      headers: {
        Authorization: Cypress.env("authHeader"),
      },
      failOnStatusCode: false, // Prevent Cypress from failing on non-2xx responses
      body: {},
    }).then((res) => {
      response = res;
    });
  });
});

Then("the response should contain a created book:", function (dataTable) {
  const expectedData = dataTable.rowsHash();
  console.log("Response body:", response.body);
  console.log("Expected data:", expectedData);

  if (response.status === 201) {
    // Validate the response contains the expected title and author
    expect(response.body).to.have.property("title", expectedData.title);
    expect(response.body).to.have.property("author", expectedData.author);

    // Optional: Validate the response includes an ID
    expect(response.body).to.have.property("id").that.is.a("number");
  } else if (response.status === 208) {
    // Failure case: validate the error message
    expect(response.body).to.equal("Book Already Exists");
  } else {
    // Unexpected response
    throw new Error(`Unexpected status code: ${response.status}`);
  }
});

Then("The response status should be {int}", (statusCode) => {
  expect(response.status).to.eq(statusCode);
});
