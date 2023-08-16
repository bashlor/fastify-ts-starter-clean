import { FastifyInstance } from 'fastify';

import { getHelloHttpHandler } from './get-hello.http.js';

export const registry = async (app: FastifyInstance) => {
  app.get(getHelloHttpHandler.url, getHelloHttpHandler.handler);
};
