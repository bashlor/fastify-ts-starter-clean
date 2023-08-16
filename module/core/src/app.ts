import * as process from 'process';

import { HttpServer } from './presentation/http-server.js';
import routerHttp from './presentation/module/router.http.js';

const httpServer = new HttpServer(3000);

httpServer.setErrorHandler((error, request, reply) => {
  httpServer.fastify?.log.error(error);

  const statusCode = Number(error.statusCode) || 500;

  if (statusCode >= 500) {
    reply.status(statusCode).send({ code: statusCode, instance: request.url, message: 'internal Server Error' });
    return;
  }

  reply.status(statusCode).send({ code: statusCode, instance: request.url, message: error.message });
});

httpServer.loadRouter(routerHttp, '/api');

httpServer.listen('0.0.0.0').then((result) => {
  if (result.isErr()) {
    httpServer.fastify?.log.error(result.error);
    process.stderr.write(result.error.message);
    process.exit(1);
  }
});
