import 'dotenv/config';

import { ENV } from '../src/config/env.js';
import { createMySqlClient } from '../src/integrations/db/createMySqlClient.js';

const db = createMySqlClient(ENV.config.db);

async function main(): Promise<void> {
  try {
    await db.query('DROP TABLE IF EXISTS results');
    await db.query('DROP TABLE IF EXISTS students');

    console.log('Tables dropped');
  } finally {
    await db.end();
  }
}

main().catch((error: unknown) => {
  console.error('Reset failed:', error);
  process.exit(1);
});
