import { asFunction } from 'awilix';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { TodoService } from '../../../application/service/todo.service.js';
import {
  DatabaseHandler,
  getMemoryDatabaseHandler,
} from '../../../infrastructure/configuration/database/database.configuration.js';
import { getContainer } from '../../../infrastructure/configuration/dependency-container/dependency-container.configuration.js';
import { TodoRepository } from '../../../infrastructure/repository/todo.repository.js';
import { HttpServer } from '../../http-server.js';
import { registry as todoRouter } from './registry.http.js';
import { PostTodoRequestBody } from './request-body/post-todo.request-body.js';

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

  it('should create a todo', async () => {
    const request: PostTodoRequestBody = {
      name: 'Todo 1',
      status: 'todo',
    };

    const app = httpServer.fastify;
    if (app === null) throw new Error('HttpServer not initialized');

    const response = await app.inject({
      method: 'POST',
      url: '/api/todo',
      payload: request,
    });

    const todoFromRepository = dbHandler.data.todos[0];

    expect(response.statusCode).toBe(201);
    expect(response.json()).toEqual({
      id: todoFromRepository.id,
      name: todoFromRepository.name,
      status: todoFromRepository.status,
    });
  });
});
