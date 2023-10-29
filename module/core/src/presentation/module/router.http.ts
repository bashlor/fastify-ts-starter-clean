import plugin from 'fastify-plugin';

import { registry as helloRouter } from './hello/registry.http.js';
import { registry as todoRouter } from './todo/registry.http.js';

export default plugin(
  async (fastify, opts: Record<symbol | number | string, unknown> & { prefix: string }) => {
    const { prefix } = opts;
    fastify.register(helloRouter, { prefix });
    fastify.register(todoRouter, { prefix });
  },
  { name: 'router' }
);
