import appConfig from './app.config';
import authConfig from './auth.config';
import databaseConfig from './database.config';
import mailConfig from './mail.config';
import redisConfig from './redis.config';
import storageConfig from './storage.config';
import servicesConfig from './services.config';

const configs = [
  appConfig,
  databaseConfig,
  authConfig,
  mailConfig,
  redisConfig,
  storageConfig,
  servicesConfig,
];

export { configs };
