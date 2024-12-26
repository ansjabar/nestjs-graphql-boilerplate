import { registerAs } from '@nestjs/config';
import { AppConfigOptions, AppEnvs } from '../@types';

export default registerAs(
  'app',
  (): AppConfigOptions => ({
    url: process.env.APP_URL,
    port: +process.env.APP_PORT,
    cwd: process.cwd(),
    name: process.env.APP_NAME || 'NestJS',
    gqlPlayground: process.env.APP_GQL_PLAYGROUND
      ? process.env.APP_GQL_PLAYGROUND === 'true'
        ? true
        : false
      : true,
    debug: process.env.APP_DEBUG
      ? process.env.APP_DEBUG === 'true'
        ? true
        : false
      : false,
    staticFilesRoute: '/files',
    key: process.env.APP_KEY,
    env: process.env.APP_ENV as AppEnvs,
    defaultLocale: process.env.APP_DEFAULT_LOCALE || 'en',
  }),
);
