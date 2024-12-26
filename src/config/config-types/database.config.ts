import { registerAs } from '@nestjs/config';
import { DatabaseConfigOptions } from '../@types';
import { join } from 'path';

export const config = () => {
  const entities = [join(__dirname, './../../**/*.entity{.ts,.js}')];

  return {
    type: process.env.DB_CONNECTION,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    password: process.env.DB_PASSWORD,
    database:
      process.env.NODE_ENV === 'test' &&
      process.env.DB_CONNECTION === 'better-sqlite3'
        ? join(process.cwd(), `./test/tmp/${process.env.DB_DATABASE}`)
        : process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    synchronize: false,
    logging: false,
    entities,
  };
};

export default registerAs('database', (): DatabaseConfigOptions => config());
