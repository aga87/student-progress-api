// src/scripts/testDbConnection.ts
import { db } from '../src/startup/container.js';

async function main(): Promise<void> {
  const [dbRows] = await db.query('SELECT DATABASE() AS databaseName');
  console.log('Connected database:', dbRows);

  const [tableRows] = await db.query('SHOW TABLES');
  console.log('Tables:', tableRows);

  await db.end();
}

main().catch((error: unknown) => {
  console.error('DB connection failed:', error);
  process.exit(1);
});
