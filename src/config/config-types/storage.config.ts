import { registerAs } from '@nestjs/config';
import { StorageConfigOptions } from '../@types';
import { join } from 'path';
import { DriverType } from '@codebrew/nestjs-storage';

/**
 * Environment configurations related to 'app'
 */
export default registerAs(
  'storage',
  (): StorageConfigOptions => ({
    defaultDisk: (process.env.STORAGE_DISK as DriverType) || DriverType.LOCAL,
    storageLocalPath:
      process.env.STORAGE_LOCAL_PATH || join(process.cwd(), './storage'),
  }),
);
