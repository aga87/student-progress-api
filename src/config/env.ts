import 'dotenv/config';
import { requireEnv } from './requireEnv.js';

export const ENV = {
  config: {
    nodeEnv: requireEnv('NODE_ENV'),
    port: Number(requireEnv('PORT')),

    db: {
      name: requireEnv('DB_NAME'),
      host: requireEnv('DB_HOST'),
      port: Number(requireEnv('DB_PORT')),
      user: requireEnv('DB_USER'),
      adminUser: requireEnv('DB_ADMIN_USER'),
    },

    dbAdmin: {
      user: requireEnv('DB_ADMIN_USER'),
    },
  },

  secrets: {
    dbPassword: requireEnv('DB_PASSWORD'),
    dbAdminPassword: requireEnv('DB_ADMIN_PASSWORD'),
  },
} as const;
