import { assertEquals } from 'typia';

import { Todo } from '../../domain/entity/todo/todo.js';
import {Err, Ok} from '../../shared/lib/monad/result/functions.js';
import {Result} from '../../shared/lib/monad/result/type.js';
import { MapperError } from './error/mapper.error.js';

export class TodoMapper {
  static fromPersistenceToDomain(todo: Todo): Result<Todo, MapperError> {
    try {
      assertEquals<Todo>(todo);

      return Ok(todo);
    } catch (error) {
      return Err(new MapperError(error));
    }
  }

  static fromDomainToPersistence(todo: Todo): Result<Todo, MapperError> {
    try {
      assertEquals<Todo>(todo);

      return Ok(todo);
    } catch (error) {
      return Err(new MapperError(error));
    }
  }
}
