import {
  DriverType,
  StorageModuleOptions,
  StorageOptionsFactory,
} from '@codebrew/nestjs-storage';
import { Injectable } from '@nestjs/common';
import { AppConfigClass } from './app-config.class';

@Injectable()
export class StorageModuleClass implements StorageOptionsFactory {
  constructor(private readonly configs: AppConfigClass) {}

  createStorageOptions(): StorageModuleOptions | Promise<StorageModuleOptions> {
    const storageConfigs = this.configs.storageConfigs;
    return {
      default: storageConfigs.defaultDisk,
      disks: {
        local: {
          driver: DriverType.LOCAL,
          config: {
            root: storageConfigs.storageLocalPath,
          },
        },
      },
    };
  }
}
