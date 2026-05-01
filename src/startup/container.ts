import { ENV } from '../config/env.js';
import { createMySqlClient, createRedisClient } from '../integrations/index.js';
import {
  StudentResultsRepository,
  StudentResultsCacheRepository,
} from '../repositories/index.js';
import {
  StudentResultsCommandService,
  StudentResultsQueryService,
} from '../services/index.js';

export const db = createMySqlClient({
  database: ENV.config.db.database,
  host: ENV.config.db.host,
  port: ENV.config.db.port,
  user: ENV.config.db.user,
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

export const studentResultsQueryService = new StudentResultsQueryService(
  studentResultsRepository,
  studentResultsCacheRepository
);

export const studentResultsCommandService = new StudentResultsCommandService(
  studentResultsRepository,
  studentResultsCacheRepository
);
