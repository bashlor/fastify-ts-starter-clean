import { DataTable, setWorldConstructor, Then, When } from '@cucumber/cucumber';
import * as assert from 'assert';
import * as crypto from 'crypto';

import { Todo } from '../../src/domain/entity/todo/todo.js';
import { CustomWorld } from '../configuration/world/custom-world.js';

setWorldConstructor(CustomWorld);
When(/^I create a todo with the data:$/, async function (this: CustomWorld, dataTable: DataTable) {
  const todoData = dataTable.hashes();

  const todo = {
    id: crypto.randomUUID(),
    name: todoData[0].name,
    status: todoData[0].status === 'todo' ? 'todo' : 'done',
  } satisfies Todo;

  await this.todoService.create(todo);
});

Then(
  /^If I request the todo list, I should get a todo with the name "([^"]*)" and the status "([^"]*)"$/,
  async function (this: CustomWorld, todoName: string, todoStatus: string) {
    const todoList = await this.todoService.getAll();

    const todoFromList = todoList.unwrap()[0];

    assert.ok(todoFromList.name === todoName, `expected ${todoName} - found : ${todoFromList.name}`);
    assert.ok(todoFromList.status === todoStatus, `expected ${todoName} - found : ${todoStatus}`);
  }
);
