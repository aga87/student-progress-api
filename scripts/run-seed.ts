import fs from 'node:fs';
import path from 'node:path';
import 'dotenv/config';

import { ENV } from '../src/config/env.js';
import { createMySqlClient } from '../src/integrations/db/createMySqlClient.js';

const seedFiles = [
  'sql/seeds/001_seed_students.sql',
  'sql/seeds/002_seed_results.sql',
];

const db = await createMySqlClient(ENV.config.db);

const runSeed = async (): Promise<void> => {
  try {
    for (const file of seedFiles) {
      const sql = fs.readFileSync(path.resolve(file), 'utf8');

      await db.query(sql);

      console.log(`Seed executed: ${file}`);
    }

    console.log('Seeding completed');
  } finally {
    await db.end();
  }
};

runSeed().catch((error: unknown) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
