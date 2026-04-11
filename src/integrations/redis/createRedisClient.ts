import { createClient } from 'redis';
import { logger } from '../../logging/logger.js';

export type RedisConfig = {
  host: string;
  port: number;
};

export type RedisClient = ReturnType<typeof createClient>;

export const createRedisClient = async (config: RedisConfig) => {
  const client = createClient({
    socket: {
      host: config.host,
      port: config.port,
    },
  });

  client.on('error', error => {
    logger.error('Redis client error', error);
  });

  await client.connect();

  return client;
};
