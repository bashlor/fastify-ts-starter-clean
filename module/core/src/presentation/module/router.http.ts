import plugin from 'fastify-plugin';

import { registry as helloRouter } from './hello/registry.http.js';
import { registry as todoRouter } from './todo/registry.http.js';

export default plugin(
  async (fastify, opts: Record<symbol | number | string, unknown> & { prefix: string }) => {
    const { prefix } = opts;
    fastify.register(helloRouter, { prefix });
    fastify.register(todoRouter, { prefix });

    fastify.register((instance, opts, done) => {
        instance.setNotFoundHandler((request, reply) => {
            reply.status(404).send({ code: 404, instance: request.url, message: 'resource not found' });
        });
        done();
    });
  },
  { name: 'router' }
);
