import { err, ok, Result } from 'neverthrow';

import { TodoCollection } from '../../../src/domain/collection/todo.collection.js';
import { Todo } from '../../../src/domain/entity/todo/todo.js';

export class TodoInMemoryRepository implements TodoCollection {
  todos: Map<string, Todo> = new Map<string, Todo>(); //Map<id, Todo>

  add(todo: Todo): Promise<Result<Todo, Error>> {
    if (this.todos.has(todo.id)) {
      const error = new Error(`Todo with id ${todo.id} already exists`);
      return Promise.resolve(err(error));
    }

    this.todos.set(todo.id, todo);
    return Promise.resolve(ok(todo));
  }

  getAll(): Promise<Result<Todo[], Error>> {
    const todos = Array.from(this.todos.values());
    return Promise.resolve(ok(todos));
  }
}
