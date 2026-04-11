import { type RedisClient } from '../integrations/redis/createRedisClient.js';

export class StudentResultsCacheRepository {
  public constructor(
    private readonly redisClient: RedisClient,
    private readonly ttlSeconds: number
  ) {}

  public async get(studentId: number): Promise<string | null> {
    return this.redisClient.get(this.buildKey(studentId));
  }

  public async set(studentId: number, value: string): Promise<void> {
    await this.redisClient.set(this.buildKey(studentId), value, {
      EX: this.ttlSeconds,
    });
  }

  public async delete(studentId: number): Promise<void> {
    await this.redisClient.del(this.buildKey(studentId));
  }

  // Builds the Redis key for a student's cached results.
  private buildKey(studentId: number): string {
    return `results:${studentId}`;
  }
}
