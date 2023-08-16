import { join } from 'node:path';

import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

import { DatabaseStructure } from '../configuration/database/database.configuration.js';

export function getDatabaseHandler(path: string) {
  const file = join(path, './db');

  const adapter = new JSONFile<DatabaseStructure>(file);
  return new Low<DatabaseStructure>(adapter, { todos: [] });
}
