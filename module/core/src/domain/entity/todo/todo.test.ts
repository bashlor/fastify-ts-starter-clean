import { describe, expect, it } from 'vitest';

import { newTodo } from './todo.js';

describe('todo', () => {
  it('should create a todo', () => {
    const todoId = '5e0c1c9c-5fbc-4500-930d-3b0ea3050102 ';
    const todo = newTodo(todoId).create();

    expect(todo.id).toBe(todoId);
    expect(todo.name).toBe('task');
    expect(todo.status).toBe('todo');
  });

  it('should create a todo with a name and a status', () => {
    const todoId = '5e0c1c9c-5fbc-4500-930d-3b0ea3050102 ';
    const todo = newTodo(todoId).withName('task 1').withStatus('done').create();

    expect(todo.id).toBe(todoId);
  });
});
