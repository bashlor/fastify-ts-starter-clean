import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { Low, Memory } from 'lowdb';
import { JSONFile } from 'lowdb/node';

import { Todo } from '../../../domain/entity/todo/todo.js';

export type DatabaseStructure = {
  todos: Todo[];
};

export type DatabaseHandler = Low<DatabaseStructure>;

// db file path
const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, 'db');

const adapter = new JSONFile<DatabaseStructure>(file);

let database: Low<DatabaseStructure>;
export function getDatabaseHandler() {
  if (!database) {
    database = new Low<DatabaseStructure>(adapter, { todos: [] });
  }
  return database;
}

export function getMemoryDatabaseHandler() {
  return new Low<DatabaseStructure>(new Memory(), {
    todos: [],
  });
}
