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

export const db = await createMySqlClient(ENV.config.db);

const redisClient = await createRedisClient(ENV.config.redis);

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
