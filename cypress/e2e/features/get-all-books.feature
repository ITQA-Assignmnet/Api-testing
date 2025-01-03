Feature: API Testing For Get All Books

    Scenario: Get a list of books by admin
        Given the API endpoint "/api/books" and user role "admin"
        When I send a GET request
        Then the response status code should be 200
        And the response should contain a list of books

    Scenario: Get a list of books by user
        Given the API endpoint "/api/books" and user role "user"
        When I send a GET request
        Then the response status code should be 200
        And the response should contain a list of books
