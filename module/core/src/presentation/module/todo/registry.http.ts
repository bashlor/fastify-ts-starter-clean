import { FastifyInstance } from 'fastify';

import { getTodoHttpHandler } from './get-todo.http.js';
import { postTodoHttpHandler } from './post-todo.http.js';

export const registry = async (app: FastifyInstance) => {
  app.get(getTodoHttpHandler.url, getTodoHttpHandler.handler);
  app.post(postTodoHttpHandler.url, postTodoHttpHandler.handler);
};
