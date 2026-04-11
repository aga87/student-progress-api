import { ENV } from '../config/env.js';
import { createMySqlClient } from '../integrations/db/client.js';
import { StudentResultsRepository } from '../repositories/studentResults.repository.js';
import { StudentResultsService } from '../services/studentResults.service.js';

export const db = createMySqlClient({
  host: ENV.config.db.host,
  port: ENV.config.db.port,
  user: ENV.config.db.user,
  password: ENV.secrets.dbPassword,
  database: ENV.config.db.name,
});

const studentResultsRepository = new StudentResultsRepository(() => db);

export const studentResultsService = new StudentResultsService(
  studentResultsRepository
);
