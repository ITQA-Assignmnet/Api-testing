Feature: API Testing For Create Book

  Scenario: Create a book by admin
    Given The API endpoint "/api/books" and user role "admin"
    When I send a POST request with the following data:
      | title       | madol doowa          |
      | author      | Martin               |
    Then the response should contain a created book:
      | title       | madol doowa          |
      | author      | Martin               |

  Scenario: Create a book by user
    Given The API endpoint "/api/books" and user role "user"
    When I send a POST request with the following data:
      | title       | hathpana          |
      | author      | mahagama sekara   |
    Then The response status should be 401

  Scenario: Create a book with an empty request body
    Given The API endpoint "/api/books" and user role "admin"
    When I send a POST request with an empty body
    Then The response status should be 400