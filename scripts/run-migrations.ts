import fs from 'node:fs';
import path from 'node:path';
import 'dotenv/config';

import { ENV } from '../src/config/env.js';
import { createMySqlClient } from '../src/integrations/db/createMySqlClient.js';
import { debugLog } from '../src/logging/debug.js';

const migrations = [
  'sql/migrations/001_create_students.sql',
  'sql/migrations/002_create_results.sql',
];

const db = createMySqlClient(ENV.config.db);

const runMigrations = async (): Promise<void> => {
  try {
    for (const file of migrations) {
      const sql = fs.readFileSync(path.resolve(file), 'utf8');

      await db.query(sql);

      debugLog(`Ran migration: ${file}`);
    }

    console.log('Migrations completed');
  } finally {
    await db.end();
  }
};

runMigrations().catch((error: unknown) => {
  console.error('Migrations failed:', error);
  process.exit(1);
});
