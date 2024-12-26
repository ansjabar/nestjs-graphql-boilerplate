import { Injectable } from '@nestjs/common';
import {
  ThrottlerModuleOptions,
  ThrottlerOptionsFactory,
} from '@nestjs/throttler';
import { AppConfigClass } from './app-config.class';

@Injectable()
export class ThrottlerModuleClass implements ThrottlerOptionsFactory {
  constructor(private readonly configs: AppConfigClass) {}
  createThrottlerOptions():
    | Promise<ThrottlerModuleOptions>
    | ThrottlerModuleOptions {
    return {
      throttlers: [
        {
          ttl: 60000,
          limit: 60,
        },
      ],
    };
  }
}
