import { diContainer } from '@fastify/awilix';
import { asFunction } from 'awilix';

import { TodoService } from '../../../application/service/todo.service.js';
import { TodoRepository } from '../../repository/todo.repository.js';
import { getDatabaseHandler } from '../database/database.configuration.js';

export function initContainer() {
  diContainer.register({
    hello: asFunction(() => 'Hello World from dependency injection !'),
    [TodoRepository.name]: asFunction(() => new TodoRepository(getDatabaseHandler())),
    [TodoService.name]: asFunction((c) => new TodoService(c[TodoRepository.name])),
  });
}

export function getContainer() {
  return diContainer;
}
