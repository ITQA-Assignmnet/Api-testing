Feature: API Testing For Get Book By Id

    Scenario: Get a book by admin
        Given The API "/api/books/1" and user role "admin"
        When I send GET request
        Then The response status code should be 200
        And The response should contain a book

    Scenario: Get a book by user
        Given The API "/api/books/1" and user role "user"
        When I send GET request
        Then The response status code should be 200
        And The response should contain a book