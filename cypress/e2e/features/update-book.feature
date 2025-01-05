Feature: API Testing For Update Book

    Scenario: Update a book by admin
        Given The API request "/api/books/1" and user role "admin"
        When I send PUT request with below data:
            | id          | 1                 |
            | title       | Agni Veenavii     |
            | author      | Kazi Nasrul Islam |
        Then The response should contain a updated book:
            | id          | 1                 |
            | title       | Agni Veenavii     |
            | author      | Kazi Nasrul Islam |

    Scenario: Update a book by user
        Given The API request "/api/books/1" and user role "user"
        When I send PUT request with below data:
            | id          | 1                 |
            | title       | Agni Veena        |
            | author      | Kazi Nasrul Islam |
        Then The response code should be 403
        And The response message should be "User is not permitted."

    Scenario: Update a book with an Empty request body
        Given The API request "/api/books/1" and user role "admin"
        When I send a PUT request with an empty body
        Then The response code should be 405


