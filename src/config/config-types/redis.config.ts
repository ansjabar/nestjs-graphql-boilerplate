import { registerAs } from '@nestjs/config';
import { RedisConfigOptions } from '../@types';

/**
 * Environment configurations related to 'app'
 */
export default registerAs(
  'redis',
  (): RedisConfigOptions => ({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    db: parseInt(process.env.REDIS_DATABASE) || 0,
    prefix: process.env.REDIS_PREFIX || 'app',
  }),
);
