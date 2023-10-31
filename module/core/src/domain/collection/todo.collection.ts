
import {Result} from '../../shared/lib/monad/result/type.js';
import { Todo } from '../entity/todo/todo.js';


export interface TodoCollection {
  add(todo: Todo): Promise<Result<Todo, Error>>;
  getAll(): Promise<Result<Todo[], Error>>;
}
