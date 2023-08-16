import { FastifyReply, FastifyRequest } from 'fastify';

export const getHelloHttpHandler = {
  url: '/hello',
  handler: getHelloHttp,
};

function getHelloHttp(
  request: FastifyRequest & { diScope: { resolve: (argument: string) => unknown } },
  reply: FastifyReply
) {
  const hello = request.diScope.resolve('hello');

  reply.send({ message: hello });
}
