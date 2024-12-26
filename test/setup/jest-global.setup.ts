import { execSync } from 'child_process';
import * as dotenv from 'dotenv';
import { mkdir, rm } from 'fs/promises';
import { join } from 'path';
import { Pool } from 'pg';

dotenv.config({ path: join(process.cwd(), './.env.test') });

module.exports = async () => {
  try {
    await rm(join(process.cwd(), './test/tmp'), { recursive: true });
  } catch (error) {}

  await mkdir(join(process.cwd(), './test/tmp'));

  if (process.env.DB_CONNECTION === 'postgres') {
    const pool = new Pool({
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      user: process.env.DB_USERNAME,
      port: parseInt(process.env.DB_PORT),
      password: process.env.DB_PASSWORD,
    });
    await pool.query('DROP SCHEMA IF EXISTS public CASCADE');
    await pool.query('CREATE SCHEMA public');
  }

  runCommand(
    'pnpm typeorm-ts-node-commonjs  migration:run -d src/database/migration.data-source.ts',
  );
  runCommand(
    'pnpm typeorm-ts-node-commonjs migration:run -d src/database/seeder.data-source.ts',
  );
};

export const runCommand = (command: string) => {
  execSync(command, { stdio: 'inherit' });
};
