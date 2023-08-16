import { Err, err, Ok, ok, Result } from 'neverthrow';

import { TodoCollection } from '../../domain/collection/todo.collection.js';
import { Todo } from '../../domain/entity/todo/todo.js';
import { DatabaseHandler } from '../configuration/database/database.configuration.js';
import { TodoMapper } from '../mapper/todo.mapper.js';
import { RepositoryError } from './error/repository.error.js';

export class TodoRepository implements TodoCollection {
  constructor(private readonly db: DatabaseHandler) {}
  async add(todo: Todo): Promise<Result<Todo, RepositoryError>> {
    try {
      const serializedTodoResult = TodoMapper.fromDomainToPersistence(todo);

      if (serializedTodoResult.isErr()) {
        const error = new RepositoryError('failed to add todo', serializedTodoResult.error, todo);

        return err(error);
      }

      this.db.data.todos.push(serializedTodoResult.value);

      await this.db.write();

      return ok(todo);
    } catch (error: any) {
      const repositoryError = new RepositoryError('failed to add todo', error, todo);

      return err(repositoryError);
    }
  }

  async getAll(): Promise<Result<Todo[], RepositoryError>> {
    try {
      await this.db.read();

      const todoResults = this.db.data.todos.map((serializedTodo) => {
        const todoResult = TodoMapper.fromPersistenceToDomain(serializedTodo);

        if (todoResult.isErr()) {
          const error = new RepositoryError('failed to get all todos', todoResult.error, serializedTodo);

          return err(error);
        }

        return ok(todoResult.value);
      });

      if (todoResults.some((todoResult) => todoResult.isErr())) {
        const errors = todoResults.filter((todoResult) => todoResult.isErr());

        const repositoryError = new RepositoryError(
          'failed to get all todos',
          undefined,
          errors as Err<never, RepositoryError>[]
        );

        return err(repositoryError);
      }

      const todos = todoResults.map((todoResult) => (todoResult as unknown as Ok<Todo, never>).value);

      return ok(todos);
    } catch (error: any) {
      const repositoryError = new RepositoryError('failed to get all todos', error);

      return err(repositoryError);
    }
  }
}
