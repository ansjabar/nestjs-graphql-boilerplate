import { Injectable } from '@nestjs/common';
import {
  ServeStaticModuleOptions,
  ServeStaticModuleOptionsFactory,
} from '@nestjs/serve-static';
import { AppConfigClass } from './app-config.class';

@Injectable()
export class ServerModuleClass implements ServeStaticModuleOptionsFactory {
  constructor(private readonly configs: AppConfigClass) {}

  createLoggerOptions():
    | ServeStaticModuleOptions[]
    | Promise<ServeStaticModuleOptions[]> {
    return [
      {
        rootPath: this.configs.storageConfigs.storageLocalPath,
        exclude: ['graphql'],
        serveRoot: this.configs.appConfigs.staticFilesRoute,
        serveStaticOptions: {
          index: false,
        },
      },
    ];
  }
}
