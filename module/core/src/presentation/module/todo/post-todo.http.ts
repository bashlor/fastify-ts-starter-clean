import * as crypto from 'crypto';
import { FastifyReply, FastifyRequest } from 'fastify';

import { TodoService } from '../../../application/service/todo.service.js';
import { newTodo, Todo } from '../../../domain/entity/todo/todo.js';
import { matchResult } from '../../../infrastructure/util/helper.util.js';
import { Err, Ok } from '../../../shared/lib/monad/result/functions.js';
import { Result } from '../../../shared/lib/monad/result/type.js';
import { HttpErrorPayload, serviceErrorToHttpPayload } from '../../error/code.error.js';
import { PostTodoRequestBody, postTodoRequestBodyValidator } from './request-body/post-todo.request-body.js';

export const postTodoHttpHandler = {
  url: '/todo',
  handler: postTodoHandler,
};

async function postTodoHandler(
  request: FastifyRequest & { diScope: { resolve: (argument: string) => unknown } },
  reply: FastifyReply
) {
  const todoService = request.diScope.resolve(TodoService.name) as TodoService;

  const requestBody = (await postTodoRequestBodyValidator.validate(request.body)) as PostTodoRequestBody;

  const requestResult = await handleRequest(request.url, requestBody, todoService);

  return matchResult(requestResult, {
    ok: (todo) => reply.status(201).send(todo),
    error: (error) => reply.status(error.code).send(error),
  });
}

async function handleRequest(
  url: string,
  body: PostTodoRequestBody,
  todoService: TodoService
): Promise<Result<Todo, HttpErrorPayload>> {
  const todoId = crypto.randomUUID();
  const todo = newTodo(todoId).withName(body.name).withStatus(body.status).create();

  const todoResult = await todoService.create(todo);

  if (todoResult.isErr()) {
    const serviceError = todoResult.error;

    const errorMessage = 'failed to create todo';
    const errorPayload = serviceErrorToHttpPayload(serviceError, url, errorMessage);

    return Err(errorPayload);
  }

  return Ok(todoResult.unwrap());
}
