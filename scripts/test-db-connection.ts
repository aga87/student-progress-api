import type { RowDataPacket } from 'mysql2';
import { ENV } from '../src/config/env.js';
import { createMySqlClient } from '../src/integrations/db/createMySqlClient.js';

type DatabaseRow = RowDataPacket & {
  databaseName: string;
};

async function main(): Promise<void> {
  const db = createMySqlClient({
    database: ENV.config.db.database,
    host: ENV.config.db.host,
    port: ENV.config.db.port,
    user: ENV.config.db.user,
  });

  try {
    const [dbRows] = await db.query<DatabaseRow[]>(
      'SELECT DATABASE() AS databaseName'
    );

    console.log('Connected database:', dbRows[0]?.databaseName);

    const [tableRows] = await db.query<RowDataPacket[]>('SHOW TABLES');

    console.log('Tables:', tableRows);
  } finally {
    await db.end();
  }
}

main().catch((error: unknown) => {
  console.error('DB connection failed:', error);
  process.exit(1);
});
