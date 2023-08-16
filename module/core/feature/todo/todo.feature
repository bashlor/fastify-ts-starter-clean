Feature: Create a todo

  Scenario: Create a todo
    When I create a todo with the data:
      | name | status |
      | My todo | done |
    Then If I request the todo list, I should get a todo with the name "My todo" and the status "done"
