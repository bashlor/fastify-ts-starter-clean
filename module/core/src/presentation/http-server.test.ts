import { fastifyPlugin } from 'fastify-plugin';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { EnvironmentConfiguration } from '../infrastructure/configuration/environment/environment.configuration.js';
import { HttpServer } from './http-server.js';
import routerHttp from './module/router.http.js';

describe('HttpServer', () => {
  let httpServer: HttpServer;

  beforeEach(() => {
    const configuration: EnvironmentConfiguration = {
      environment: 'test',
      host: '0.0.0.0',
      port: 3000,
      allowedOrigins: [],
      cors: false,
    };

    httpServer = new HttpServer(configuration);
  });

  afterEach(() => {
    httpServer.close();
  });

  describe('listen', () => {
    it('should have  listen method', () => {
      expect(httpServer.listen).toBeInstanceOf(Function);
    });

    it('should return a null result object if everything went well', async () => {
      const result = await httpServer.listen('localhost');
      expect(result.unwrap()).toBeNull();
    });

    it('should return an error if something went wrong', async () => {
      const configuration: EnvironmentConfiguration = {
        environment: 'test',
        host: '0.0.0.0',
        port: 3000,
        allowedOrigins: [],
        cors: false,
      };

      const httpServer2 = new HttpServer(configuration);

      await httpServer.listen('localhost');
      const result2 = await httpServer2.listen('localhost');

      expect(result2._unsafeUnwrap()).toBeInstanceOf(Error);
    });

    it('should return an error if listen is called on a closed server', async () => {
      await httpServer.close();
      const result = await httpServer.listen('0.0.0.0');

      expect(result.isErr()).toBeTruthy();
      expect(result._unsafeUnwrap()).toBeInstanceOf(Error);
    });
  });

  describe('setErrorHandler', () => {
    it('should have a method setErrorHandler', () => {
      expect(httpServer.setErrorHandler).toBeInstanceOf(Function);
    });

    it('should execute error handler if error is thrown', async () => {
      if (httpServer.fastify === null) throw new Error('HttpServer not initialized');

      const router = fastifyPlugin(async (fastify, opts) => {
        fastify.get('/api/error_test', async () => {
          throw new Error('Error thrown');
        });
      });

      httpServer.fastify.register(router, { prefix: '/api' });
      httpServer.setErrorHandler((error, request, reply) => {
        if (error) {
          reply.status(500).send({ message: 'internal server error' });
        }
      });

      const result = await httpServer.fastify.inject({
        method: 'GET',
        url: '/api/error_test',
      });

      expect(result.statusCode).toBe(500);
      expect(result.json()).toEqual({ message: 'internal server error' });
    });

    it('should return an Error if the HttpServer has been closed', async () => {
      await httpServer.close();

      const result = httpServer.setErrorHandler((error) => {
        console.error(error);
      });

      expect(result?.isErr()).toBeTruthy();
      expect(result?._unsafeUnwrap()).toBeInstanceOf(Error);
    });
  });

  describe('close', () => {
    it('should have close method', () => {
      expect(httpServer.close).toBeInstanceOf(Function);
    });

    it('should execute a result if the server was initialized', async () => {
      await httpServer.listen('localhost');
      const closeResult = await httpServer.close();
      expect(closeResult._unsafeUnwrap()).toBeNull();
    });

    it('should execute an error if the server was not initialized', async () => {
      const configuration: EnvironmentConfiguration = {
        environment: 'test',
        host: '0.0.0.0',
        port: 5000,
        allowedOrigins: [],
        cors: false,
      };

      const httpServer2 = new HttpServer(configuration);
      const closeResult = await httpServer2.close();
      const closeResult2 = await httpServer2.close();

      expect(closeResult.isOk()).toBe(true); // Even if the listen method was not called, the close method returns an ok result at the first time it is called, and results in an error at the second time it is called.

      expect(closeResult2.isErr()).toBe(true); // Return this time an error, because the fastify instance has been reset.
      expect(closeResult2._unsafeUnwrap()).toBeInstanceOf(Error);
    });
  });

  describe('loadRouter', () => {
    it('should have a method loadRouter', () => {
      expect(httpServer.loadRouter).toBeInstanceOf(Function);
    });

    it('should load the handlers or routers and return a result', async () => {
      const router = fastifyPlugin(async (fastify, opts) => {
        fastify.get('/api/test', async () => {
          return { message: 'test' };
        });
      });

      httpServer.loadRouter(router, '/api');

      if (httpServer.fastify === null) throw new Error('HttpServer not initialized');

      const result = await httpServer.fastify.inject({
        method: 'GET',
        url: '/api/test',
      });

      expect(result.statusCode).toBe(200);
      expect(result.json()).toEqual({ message: 'test' });
    });

    it('should return an error if the httpServer has been closed', async () => {
      await httpServer.close();

      const loadHandlersResult = await httpServer.loadRouter(routerHttp, '/');

      expect(loadHandlersResult.isErr()).toBeTruthy();
      expect(loadHandlersResult._unsafeUnwrap()).toBeInstanceOf(Error);
    });
  });
});
