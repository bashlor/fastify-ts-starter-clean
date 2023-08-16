import { IWorldOptions, World } from '@cucumber/cucumber';

import { TodoService } from '../../../src/application/service/todo.service.js';
import { TodoInMemoryRepository } from '../in-memory-repository/todo.in-memory-repository.js';

export class CustomWorld extends World implements CustomWorldInterface {
  todoRepository = new TodoInMemoryRepository();
  todoService = new TodoService(this.todoRepository);

  constructor(options: IWorldOptions) {
    super(options);
  }

  foo() {
    return 'bar';
  }
}

interface CustomWorldInterface {
  foo(): void;
}
