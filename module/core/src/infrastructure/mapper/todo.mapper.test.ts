import { describe, expect, it } from 'vitest';

import { Todo } from '../../domain/entity/todo/todo.js';
import { TodoMapper } from './todo.mapper.js';

describe('TodoMapper', () => {
  it('should map from persistence to domain', () => {
    const todo = {
      id: '3a9b3116-225d-460a-9d07-b3aba0519a5b',
      name: 'task',
      status: 'todo',
    } satisfies Todo;

    const result = TodoMapper.fromPersistenceToDomain(todo);

    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap()).toEqual(todo);
  });

  it('should map from domain to persistence', () => {
    const todo = {
      id: '3a9b3116-225d-460a-9d07-b3aba0519a5b',
      name: 'task',
      status: 'todo',
    } satisfies Todo;

    const result = TodoMapper.fromDomainToPersistence(todo);

    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap()).toEqual(todo);
  });
});
