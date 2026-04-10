import fs from 'node:fs';
import path from 'node:path';
import 'dotenv/config';

import { db } from '../src/startup/container.js';

const seedFiles = [
  'sql/seeds/001_seed_students.sql',
  'sql/seeds/002_seed_results.sql',
];

const runSeed = async () => {
  for (const file of seedFiles) {
    const sql = fs.readFileSync(path.resolve(file), 'utf8');

    await db.query(sql);

    console.log(`Seed executed: ${file}`);
  }
};

runSeed()
  .then(() => {
    console.log('Seeding completed');
    process.exit(0);
  })
  .catch((error: unknown) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });
