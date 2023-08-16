import fs from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { Low } from 'lowdb';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { newTodo } from '../../domain/entity/todo/todo.js';
import { DatabaseStructure } from '../configuration/database/database.configuration.js';
import { getDatabaseHandler } from '../test-helper/util.test-helper.js';
import { TodoRepository } from './todo.repository.js';

describe('TodoRepository', () => {
  let todoRepository: TodoRepository;
  let dbHandler: Low<DatabaseStructure>;
  let folderPath: string;

  beforeAll(() => {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    folderPath = join(__dirname, '../../../../../temp');

    fs.mkdirSync(folderPath, { recursive: true });
  });

  beforeEach(() => {
    dbHandler = getDatabaseHandler(folderPath);

    todoRepository = new TodoRepository(dbHandler);
  });

  afterEach(() => {
    const dbPath = join(folderPath, '/db');
    if (!fs.existsSync(dbPath)) throw new Error('database file not found. Cannot delete it.');
  });

  afterAll(() => {
    fs.rmSync(folderPath, { recursive: true });
  });

  it('should add successfully a todo', async () => {
    const todoId = 'd37c509a-f616-455b-97e1-a6a7d61513dc ';
    const todo = newTodo(todoId).create();

    const result = await todoRepository.add(todo);

    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap()).toBe(todo);
  });

  it('should get successfully todos', async () => {
    const todoId1 = 'd37c509a-f616-455b-97e1-a6a7d61513dc ';
    const todoId2 = 'd37c509a-f616-455b-97e1-a6a7d61513dd ';

    const todo1 = newTodo(todoId1).create();
    const todo2 = newTodo(todoId2).create();

    dbHandler.data.todos.push(todo1);
    dbHandler.data.todos.push(todo2);

    await dbHandler.write();

    const result = await todoRepository.getAll();

    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap()).toStrictEqual([todo1, todo2]);
  });
});
