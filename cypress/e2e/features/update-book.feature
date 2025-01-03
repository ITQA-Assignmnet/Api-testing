Feature: API Testing For Update Book

    Scenario: Update a book by admin
        Given The API request "/api/books/1" and user role "admin"
        When I send PUT request with below data:
            | id          | 1                 |
            | title       | Agni Veena        |
            | author      | Kazi Nasrul Islam |
        Then The response should contain a updated book:
            | id          | 1                 |
            | title       | Agni Veena        |
            | author      | Kazi Nasrul Islam |