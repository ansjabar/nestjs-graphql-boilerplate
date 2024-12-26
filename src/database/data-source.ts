import { config } from '../config/config-types/database.config';
import { DataSource, DataSourceOptions } from 'typeorm';

let dataSource: DataSource;

export async function initDataSource() {
  dataSource = new DataSource({
    ...config(),
  } as DataSourceOptions);
}

export { dataSource };
