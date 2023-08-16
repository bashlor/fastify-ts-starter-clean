export interface Todo {
  id: string;
  name: string;
  status: 'todo' | 'done';
}

const defaultTodoName = 'task';
const defaultTodoStatus = 'todo';

export function newTodo(id: string) {
  const todoId = id;

  function withName(name: string) {
    this.name = name;
    return this;
  }

  function withStatus(status: 'todo' | 'done') {
    this.status = status;
    return this;
  }

  function create(): Todo {
    return {
      id: todoId,
      name: this.name || defaultTodoName,
      status: this.status || defaultTodoStatus,
    };
  }

  return {
    withName,
    withStatus,
    create,
  };
}
