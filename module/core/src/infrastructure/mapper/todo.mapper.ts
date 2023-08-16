import { err, ok, Result } from 'neverthrow';
import { assertEquals } from 'typia';

import { Todo } from '../../domain/entity/todo/todo.js';
import { MapperError } from './error/mapper.error.js';

export class TodoMapper {
  static fromPersistenceToDomain(todo: Todo): Result<Todo, MapperError> {
    try {
      assertEquals<Todo>(todo);

      return ok(todo);
    } catch (error) {
      return err(new MapperError(error));
    }
  }

  static fromDomainToPersistence(todo: Todo): Result<Todo, MapperError> {
    try {
      assertEquals<Todo>(todo);

      return ok(todo);
    } catch (error) {
      return err(new MapperError(error));
    }
  }
}
