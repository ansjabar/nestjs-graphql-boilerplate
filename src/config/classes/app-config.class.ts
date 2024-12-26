import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AccessTokenConfigOptions,
  AppConfigOptions,
  DatabaseConfigOptions,
  GoogleAuthConfigOptions,
  MailConfigOptions,
  RedisConfigOptions,
  ServicesConfigOptions,
  StorageConfigOptions,
} from '../@types';

@Injectable()
export class AppConfigClass {
  constructor(private readonly configService: ConfigService) {}

  get appConfigs(): AppConfigOptions {
    return this.configService.get<AppConfigOptions>('app');
  }

  get accessTokenConfigs(): AccessTokenConfigOptions {
    return this.configService.get<AccessTokenConfigOptions>('auth.accessToken');
  }

  get googleAuthConfigs(): GoogleAuthConfigOptions {
    return this.configService.get<GoogleAuthConfigOptions>('auth.google');
  }

  get mailConfigs(): MailConfigOptions {
    return this.configService.get<MailConfigOptions>('mail');
  }

  get redisConfigs(): RedisConfigOptions {
    return this.configService.get<RedisConfigOptions>('redis');
  }

  get databaseConfigs(): DatabaseConfigOptions {
    return this.configService.get<DatabaseConfigOptions>('database');
  }

  get storageConfigs(): StorageConfigOptions {
    return this.configService.get<StorageConfigOptions>('storage');
  }

  get servicesConfigs(): ServicesConfigOptions {
    return this.configService.get<ServicesConfigOptions>('services');
  }
}
