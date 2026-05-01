import 'dotenv/config';
import { requireEnv } from './requireEnv.js';
import type { MySqlConfig } from '../integrations/db/createMySqlClient.js';

export const ENV = {
  config: {
    nodeEnv: requireEnv('NODE_ENV'),
    port: Number(requireEnv('PORT')),

    db: {
      database: requireEnv('DB_NAME'),
      host: requireEnv('DB_HOST'),
      port: Number(requireEnv('DB_PORT')),
      user: requireEnv('DB_USER'),
    } satisfies MySqlConfig,

    redis: {
      host: requireEnv('REDIS_HOST'),
      port: Number(requireEnv('REDIS_PORT')),
      ttlSeconds: Number(requireEnv('REDIS_TTL_SECONDS')),
    },
  },
} as const;
