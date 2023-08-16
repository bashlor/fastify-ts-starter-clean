import { asFunction } from 'awilix';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { getContainer } from '../../../infrastructure/configuration/dependency-container/dependency-container.configuration.js';
import { HttpServer } from '../../http-server.js';
import { registry as helloRouter } from './registry.http.js';

describe('/api/hello', () => {
  let httpServer: HttpServer;
  beforeEach(() => {
    httpServer = new HttpServer(3000);
    httpServer.loadRouter(helloRouter, '/api');
  });

  afterEach(async () => {
    const result = await httpServer.close();
    expect(result.isOk()).toBe(true);
  });

  it('should return message "Hello World from dependency injection !"', async () => {
    const app = httpServer.fastify;
    if (app === null) throw new Error('HttpServer not initialized');

    const response = await app.inject({
      method: 'GET',
      url: '/api/hello',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ message: 'Hello World from dependency injection !' });
  });

  it('should return message "Overridden message from dependency injection !"', async () => {
    const app = httpServer.fastify;
    if (app === null) throw new Error('HttpServer not initialized');

    const container = getContainer();

    container.register({
      hello: asFunction(() => 'Overridden message from dependency injection !'),
    });

    const response = await app.inject({
      method: 'GET',
      url: '/api/hello',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ message: 'Overridden message from dependency injection !' });
  });
});
