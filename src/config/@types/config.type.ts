import { DriverType } from '@codebrew/nestjs-storage';
import { Minutes } from '../../common/@types';

export enum AppEnvs {
  LOCAL = 'local',
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
  TEST = 'test',
}

export type AppConfigOptions = {
  url: string;
  cwd: string;
  name: string;
  port: number;
  key: string;
  env: AppEnvs;
  debug: boolean;
  defaultLocale: string;
  gqlPlayground: boolean;
  staticFilesRoute: string;
};

export type DatabaseConfigOptions = {
  type: string;
  host?: string;
  port?: number;
  password?: string;
  database: string;
  username?: string;
  synchronize?: boolean;
  logging?: boolean;
  entities: string[];
};

export type RedisConfigOptions = {
  host: string;
  port: number;
  db: number;
  prefix: string;
};

export type MailConfigOptions = {
  host: string;
  mailer: string;
  from: string;
  port: number;
  encryption: string;
  username: string;
  password: string;
  sendMailPath: string;
  disabled: boolean;
};

export type AuthConfigOptions = {
  google: GoogleAuthConfigOptions;
  accessToken: AccessTokenConfigOptions;
};

export type AccessTokenConfigOptions = {
  expiry: Minutes;
};

export type GoogleAuthConfigOptions = {
  clientId: string;
  clientSecret: string;
  redirectUrl: string;
};

export type StorageConfigOptions = {
  defaultDisk: DriverType;
  storageLocalPath: string;
};

type BugsnagConfigOptions = {
  apiKey: string;
  releaseStage: string;
};

export type ServicesConfigOptions = {
  bugsnag: BugsnagConfigOptions;
};
