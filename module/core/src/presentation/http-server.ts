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

export class HttpServer {
  fastify: FastifyInstance | null = null;
  port: number;

  constructor(port: number) {
    this.init();
    this.loadInternalPlugins();
    this.port = port;
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
    if (this.fastify) {
      this.fastify.register(fastifyCors, {
        origin: '*',
      });
    }
  }
}
