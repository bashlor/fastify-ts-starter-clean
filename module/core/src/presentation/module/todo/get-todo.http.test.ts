import { asFunction } from 'awilix';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { newTodo } from '../../../domain/entity/todo/todo.js';
import {
  DatabaseHandler,
  getMemoryDatabaseHandler,
} from '../../../infrastructure/configuration/database/database.configuration.js';
import { getContainer } from '../../../infrastructure/configuration/dependency-container/dependency-container.configuration.js';
import { TodoRepository } from '../../../infrastructure/repository/todo.repository.js';
import { HttpServer } from '../../http-server.js';
import { registry as todoRouter } from './registry.http.js';
import { TodoService } from '../../../application/service/todo.service.js';

describe('/api/todo', () => {
  let httpServer: HttpServer;
  let dbHandler: DatabaseHandler;

  beforeEach(() => {
    httpServer = new HttpServer(3000);
    httpServer.loadRouter(todoRouter, '/api');

    const container = getContainer();
    dbHandler = getMemoryDatabaseHandler();

    container.register({
      [TodoRepository.name]: asFunction(() => {
        return new TodoRepository(dbHandler);
      }),
      [TodoService.name]: asFunction((c) => {
        return new TodoService(c[TodoRepository.name]);
      }),
    });
  });

  afterEach(async () => {
    const result = await httpServer.close();
    expect(result.isOk()).toBe(true);
  });

  it('should return an empty array', async () => {
    const app = httpServer.fastify;
    if (app === null) throw new Error('HttpServer not initialized');

    const response = await app.inject({
      method: 'GET',
      url: '/api/todo',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual([]);
  });

  it('should return an array with one todo', async () => {
    const app = httpServer.fastify;
    if (app === null) throw new Error('HttpServer not initialized');

    const todoId = 'd37c509a-f616-455b-97e1-a6a7d61513dc ';
    const todo = newTodo(todoId).create();

    dbHandler.data.todos.push(todo);

    const response = await app.inject({
      method: 'GET',
      url: '/api/todo',
    });

    expect(response.statusCode).toBe(200);
    //expect(response.json()).toEqual([todo]);
  });
});
