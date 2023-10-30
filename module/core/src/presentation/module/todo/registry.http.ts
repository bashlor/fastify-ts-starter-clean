import { FastifyInstance } from 'fastify';

import { getTodoHttpHandler } from './get-todo.http.js';
import { postTodoHttpHandler } from './post-todo.http.js';

const url = '/todo';

export const registry = async (app: FastifyInstance) => {

  app.route({
    method: 'GET',
    url,
    handler: getTodoHttpHandler.handler,
  })

    app.route({
        method: 'POST',
        url,
        handler: postTodoHttpHandler.handler,
    })

};
