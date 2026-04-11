import { ENV } from '../config/env.js';
import { createMySqlClient, createRedisClient } from '../integrations/index.js';
import {
  StudentResultsRepository,
  StudentResultsCacheRepository,
} from '../repositories/index.js';
import { StudentResultsService } from '../services/studentResults.service.js';

export const db = createMySqlClient({
  host: ENV.config.db.host,
  port: ENV.config.db.port,
  user: ENV.config.db.user,
  password: ENV.secrets.dbPassword,
  database: ENV.config.db.name,
});

const redisClient = await createRedisClient({
  host: ENV.config.redis.host,
  port: ENV.config.redis.port,
});

const studentResultsRepository = new StudentResultsRepository(() => db);

export const studentResultsCacheRepository = new StudentResultsCacheRepository(
  redisClient,
  ENV.config.redis.ttlSeconds
);

export const studentResultsService = new StudentResultsService(
  studentResultsRepository,
  studentResultsCacheRepository
);
