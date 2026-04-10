import fs from 'fs';
import path from 'path';
import { db } from '../src/startup/container.js';
import { debugLog } from '../src/logging/debug.js';

const run = async () => {
  const migrations = [
    'sql/migrations/001_create_students.sql',
    'sql/migrations/002_create_results.sql',
  ];

  for (const file of migrations) {
    const sql = fs.readFileSync(path.resolve(file), 'utf-8');
    await db.query(sql);
    debugLog(`Ran migration: ${file}`);
  }

  process.exit(0);
};

run();
