import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { DatabaseConfigOptions } from '../@types';
import { AppConfigClass } from './app-config.class';

@Injectable()
export class TypeormModuleClass implements TypeOrmOptionsFactory {
  constructor(private readonly configs: AppConfigClass) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const databaseConfigs: DatabaseConfigOptions = this.configs.databaseConfigs;

    return {
      type: databaseConfigs.type as any,
      host: databaseConfigs.host,
      port: databaseConfigs.port,
      password: databaseConfigs.password,
      database: databaseConfigs.database,
      username: databaseConfigs.username,
      synchronize: databaseConfigs.synchronize,
      logging: databaseConfigs.logging,
      entities: databaseConfigs.entities,
    };
  }
}
