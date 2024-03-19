import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { VariablesModule } from './../configs';

@Injectable()
export class RedisService {
  private redisClient: Redis;

  constructor() {
    this.redisClient = new Redis({
      host:
        VariablesModule.variables.redis_host ||
        '172.17.0.1',
      port:
        Number(
          VariablesModule.variables
            .redis_exposing_port,
        ) || 6379,
      password:
        VariablesModule.variables
          .redis_password || '',
    });
  }

  async deleteListOfKeysWithPattern(
    keys: Array<string>,
  ): Promise<void> {
    if (keys && keys.length) {
      const promises: Promise<void>[] = [];

      // eslint-disable-next-line no-restricted-syntax
      for (const key of keys) {
        promises.push(
          this.deleteKeysWithPattern(key),
        );
      }

      try {
        await Promise.all(promises);
        console.log(
          'All cache deletion operations completed successfully.',
        );
      } catch (error) {
        console.error(
          'An error occurred during cache deletion:',
          error,
        );
      }
    }
  }

  async deleteKeysWithPattern(
    pattern: string,
  ): Promise<void> {
    const stream = this.redisClient.scanStream({
      match: pattern,
      count: 100,
    });
    const pipeline = this.redisClient.pipeline();

    stream.on('data', (resultKeys: string[]) => {
      if (resultKeys.length) {
        pipeline.del(...resultKeys);
      }
    });

    stream.on('end', async () => {
      await pipeline.exec();
      console.log('All matching keys deleted');
    });
  }
}
