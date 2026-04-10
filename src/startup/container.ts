import { ENV } from '../config/env.js';
import { createMySqlClient } from '../integrations/db/client.js';

export const db = createMySqlClient({
  host: ENV.config.db.host,
  port: ENV.config.db.port,
  user: ENV.config.db.user,
  password: ENV.secrets.dbPassword,
  database: ENV.config.db.name,
});
