import {
  BullRootModuleOptions,
  SharedBullConfigurationFactory,
} from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { AppConfigClass } from './app-config.class';
import { RedisConfigOptions } from '../@types';

@Injectable()
export class BullModuleClass implements SharedBullConfigurationFactory {
  constructor(private readonly configs: AppConfigClass) {}

  createSharedConfiguration():
    | BullRootModuleOptions
    | Promise<BullRootModuleOptions> {
    const redisConfigs: RedisConfigOptions = this.configs.redisConfigs;
    return {
      redis: {
        host: redisConfigs.host,
        port: redisConfigs.port,
        db: redisConfigs.db,
      },
      prefix: redisConfigs.prefix,
    };
  }
}
