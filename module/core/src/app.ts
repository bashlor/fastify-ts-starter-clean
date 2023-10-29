import { errors } from '@vinejs/vine';
import * as process from 'process';

import { HttpServer } from './presentation/http-server.js';
import routerHttp from './presentation/module/router.http.js';

const httpServer = new HttpServer(3000);

httpServer.setErrorHandler((error, request, reply) => {
  httpServer.fastify?.log.error(error);

  const fastifyStatusCode = Number(error.statusCode) || 500;

  if (error instanceof errors.E_VALIDATION_ERROR) {
    reply.status(400).send({ code: error.status, instance: request.url, details: error.messages });
    return;
  }

  if (fastifyStatusCode >= 500) {
    reply.status(fastifyStatusCode).send({ code: fastifyStatusCode, instance: request.url, message: 'internal server error' });
    return;
  }

  reply.status(fastifyStatusCode).send({ code: fastifyStatusCode, instance: request.url, message: error.message });
});

httpServer.loadRouter(routerHttp, '/api');

httpServer.listen('0.0.0.0').then((result) => {
  if (result.isErr()) {
    httpServer.fastify?.log.error(result.error);
    process.stderr.write(result.error.message);
    process.exit(1);
  }
});
