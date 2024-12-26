import { config } from '../config/config-types/database.config';
import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSource = new DataSource({
  ...config(),
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
} as DataSourceOptions);
