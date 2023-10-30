import { FastifyInstance } from 'fastify';

import {methodNotAllowedHandler} from '../../util/handler.util.js';
import { getHelloHttpHandler } from './get-hello.http.js';


const url = '/hello';

export const registry = async (app: FastifyInstance) => {
  app.route({
    method: 'GET',
    url,
    handler: getHelloHttpHandler.handler,
  })

  app.route({
    method: ['HEAD','PUT','DELETE','PATCH','POST'],
    url,
    handler: methodNotAllowedHandler,
  })
};
