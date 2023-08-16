import { err, ok, Result } from 'neverthrow';

import { TodoCollection } from '../../domain/collection/todo.collection.js';
import { Todo } from '../../domain/entity/todo/todo.js';
import { ErrorCode } from './error/code.error.js';
import { ServiceError } from './error/service.error.js';

export class TodoService {
  constructor(private readonly todos: TodoCollection) {}

  async create(todo: Todo): Promise<Result<Todo, ServiceError>> {
    const addResult = await this.todos.add(todo);

    if (addResult.isErr()) {
      const repositoryError = addResult.error;

      const serviceError = {
        code: ErrorCode.OperationFailed,
        internalError: repositoryError,
        safeMessage: 'Failed to create todo',
      };

      return err(serviceError);
    }

    return ok(addResult.value);
  }

  async getAll(): Promise<Result<Todo[], ServiceError>> {
    const getAllResult = await this.todos.getAll();

    if (getAllResult.isErr()) {
      const repositoryError = getAllResult.error;

      const serviceError = {
        code: ErrorCode.OperationFailed,
        internalError: repositoryError,
        safeMessage: 'Failed to get todos',
      };

      return err(serviceError);
    }

    return ok(getAllResult.value);
  }
}
