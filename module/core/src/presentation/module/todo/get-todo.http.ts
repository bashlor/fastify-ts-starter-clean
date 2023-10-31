import { FastifyReply, FastifyRequest } from 'fastify';

import { TodoService } from '../../../application/service/todo.service.js';
import { Todo } from '../../../domain/entity/todo/todo.js';
import { matchResult } from '../../../infrastructure/util/helper.util.js';
import { Err, Ok } from '../../../shared/lib/monad/result/functions.js';
import { Result } from '../../../shared/lib/monad/result/type.js';
import { HttpErrorPayload, serviceErrorToHttpPayload } from '../../error/code.error.js';

export const getTodoHttpHandler = {
  url: '/todo',
  handler: getTodoHandler,
};

async function getTodoHandler(
  request: FastifyRequest & { diScope: { resolve: (argument: string) => unknown } },
  reply: FastifyReply
) {
  const todoService = request.diScope.resolve(TodoService.name) as TodoService;

  const requestResult = await handleRequest(todoService);

  return matchResult(requestResult, {
    ok: (todos) => reply.status(200).send(todos),
    error: (error) => reply.status(error.code).send(error),
  });
}

async function handleRequest(todoService: TodoService): Promise<Result<Todo[], HttpErrorPayload>> {
  const todos = await todoService.getAll();

  if (todos.isErr()) {
    const serviceError = todos.error;

    const httpErrorPayload = serviceErrorToHttpPayload(serviceError, getTodoHttpHandler.url, 'failed to get todos');

    return Err(httpErrorPayload);
  }

  return Ok(todos.unwrap());
}
