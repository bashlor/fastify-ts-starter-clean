import { fastifyAwilixPlugin } from '@fastify/awilix';
import { fastifyCors } from '@fastify/cors';
import {
  fastify,
  FastifyError,
  FastifyInstance,
  FastifyPluginAsync,
  FastifyPluginCallback,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import { err, ok, Result } from 'neverthrow';

import { initContainer } from '../infrastructure/configuration/dependency-container/dependency-container.configuration.js';
import { EnvironmentConfiguration } from '../infrastructure/configuration/environment/environment.configuration.js';

export class HttpServer {
  fastify: FastifyInstance | null = null;
  port: number;
  allowedOrigins: URL[] = [];
  cors: boolean;

  constructor(configuration: EnvironmentConfiguration) {
    this.port = configuration.port;
    this.allowedOrigins = configuration.allowedOrigins;
    this.cors = configuration.cors;

    this.init();
    this.loadInternalPlugins();
  }

  async listen(host: string): Promise<Result<null, Error>> {
    try {
      if (!this.fastify) return err(new Error('HttpServer has been closed.'));
      await this.fastify.listen({
        port: this.port,
        host,
      });
      return ok(null);
    } catch (error) {
      return err(error as Error);
    }
  }

  async close(): Promise<Result<null, Error>> {
    if (this.fastify === null) return err(new Error('Server is not listening'));
    try {
      await this.fastify.close();
      this.fastify = null;
      return ok(null);
    } catch (error) {
      return err(error as Error);
    }
  }

  setErrorHandler(handler: (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => void) {
    try {
      if (!this.fastify) return err(new Error('HttpServer has been closed.'));
      this.fastify.setErrorHandler(handler);
    } catch (error) {
      return err(error as Error);
    }
  }

  loadRouter(router: FastifyPluginAsync, prefix?: string): Result<null, Error> {
    try {
      if (!this.fastify) return err(new Error('HttpServer has been closed.'));
      this.fastify.register(router, { prefix });
      return ok(null);
    } catch (error) {
      return err(error as Error);
    }
  }

  loadExternalPlugin(plugin: FastifyPluginCallback | FastifyPluginAsync, ...args: any[]): Result<null, Error> {
    try {
      if (!this.fastify) return err(new Error('HttpServer has been closed.'));
      this.fastify.register(plugin, ...args);
      return ok(null);
    } catch (error) {
      return err(error as Error);
    }
  }

  private init() {
    this.fastify = fastify({ logger: true });
    this.fastify.register(fastifyAwilixPlugin, {
      disposeOnResponse: true,
      disposeOnClose: true,
    });

    initContainer();
  }
  private loadInternalPlugins() {
    if (this.fastify && this.cors) {
      this.fastify.register(fastifyCors, {
        origin: this.cors ? this.allowedOrigins.map((origin) => origin.toString()) : '*',
        methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS', 'HEAD'],
        allowedHeaders: ['Content-Type', 'Authorization'],
      });

      this.fastify.addHook('onRequest', (request, reply, done) => {
        const origin = request.headers.origin;

        if (!origin) {
          reply.status(403).send({
            code: 403,
            instance: request.url,
            message: 'access denied',
          });

          done();
          return;
        }

        const originURL = new URL(origin);

        if (origin && !this.allowedOrigins.some((allowedOrigin) => originURL.hostname === allowedOrigin.hostname)) {
          reply.status(403).send({
            code: 403,
            instance: request.url,
            message: 'Forbidden',
          });

          done();
          return;
        }

        reply.header('Access-Control-Allow-Origin', origin);
        reply.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        reply.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        done();


      });
    }
  }
}
