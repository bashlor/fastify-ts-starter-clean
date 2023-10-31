import { TodoCollection } from '../../domain/collection/todo.collection.js';
import { Todo } from '../../domain/entity/todo/todo.js';
import {Err, Ok} from '../../shared/lib/monad/result/functions.js';
import {Result} from '../../shared/lib/monad/result/type.js';
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

        return Err(error);
      }

      this.db.data.todos.push(serializedTodoResult.unwrap());

      await this.db.write();

      return Ok(todo);
    } catch (error: any) {
      const repositoryError = new RepositoryError('failed to add todo', error, todo);

      return Err(repositoryError);
    }
  }

  async getAll(): Promise<Result<Todo[], RepositoryError>> {
    try {
      await this.db.read();

      const todoResults = this.db.data.todos.map((serializedTodo) => {
        const todoResult = TodoMapper.fromPersistenceToDomain(serializedTodo);

        if (todoResult.isErr()) {
          todoResult
          const error = new RepositoryError('failed to get all todos', todoResult.error, serializedTodo);

          return Err(error);
        }


        return Ok(todoResult.unwrap());
      });



      if (todoResults.some((todoResult) => todoResult.isErr())) {
        const errors = todoResults.filter((todoResult) => todoResult.isErr());

        const repositoryError = new RepositoryError(
            'failed to get all todos',
            undefined,
            errors
        );

        return Err(repositoryError);
      }

      const todos = todoResults.map((todoResult) => todoResult.unwrap());

      return Ok(todos);
    } catch (error: any) {
      const repositoryError = new RepositoryError('failed to get all todos', error);

      return Err(repositoryError);
    }
  }

}

