import { errors } from '@vinejs/vine';
import * as process from 'process';

import {
  checkEnvironment,
  environmentConfiguration,
} from './infrastructure/configuration/environment/environment.configuration.js';
import { HttpServer } from './presentation/http-server.js';
import routerHttp from './presentation/module/router.http.js';

checkEnvironment();
const environment = environmentConfiguration();

const httpServer = new HttpServer(environment);

httpServer.setErrorHandler((error, request, reply) => {
  httpServer.fastify?.log.error(error);

  const fastifyStatusCode = Number(error.statusCode) || 500;

  //VineJS validation error
  if (error instanceof errors.E_VALIDATION_ERROR) {
    reply.status(error.status).send({ code: error.status, instance: request.url, details: error.messages });
    return;
  }

  if (fastifyStatusCode >= 500) {
    reply
      .status(fastifyStatusCode)
      .send({ code: fastifyStatusCode, instance: request.url, message: 'internal server error' });
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

process.on('SIGTERM', () => {
  httpServer.fastify?.log.info('SIGTERM signal received.');

  //Close resources, like database connections, file handles etc...

  httpServer.close().then((result) => {
    if (result.isErr()) {
      httpServer.fastify?.log.error(result.error);
      process.stderr.write(result.error.message);
      process.exit(1);
    }
    process.exit(0);
  });


});
