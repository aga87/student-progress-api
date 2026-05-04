import 'dotenv/config';
import { requireEnv } from './requireEnv.js';
import type { MySqlConfig } from '../integrations/db/createMySqlClient.js';

const dbConfig: MySqlConfig =
  process.env.DB_CONNECTION_TYPE === 'cloud-sql-iam'
    ? {
        connectionType: 'cloud-sql-iam',
        instanceConnectionName: requireEnv('DB_INSTANCE_CONNECTION_NAME'),
        user: requireEnv('DB_USER'),
        database: requireEnv('DB_NAME'),
      }
    : {
        connectionType: 'tcp',
        host: requireEnv('DB_HOST'),
        port: Number(requireEnv('DB_PORT')),
        user: requireEnv('DB_USER'),
        database: requireEnv('DB_NAME'),
      };

export const ENV = {
  config: {
    nodeEnv: requireEnv('NODE_ENV'),
    port: Number(process.env.PORT ?? 3001),

    db: dbConfig,

    redis: {
      host: requireEnv('REDIS_HOST'),
      port: Number(requireEnv('REDIS_PORT')),
      ttlSeconds: Number(requireEnv('REDIS_TTL_SECONDS')),
    },
  },
} as const;
