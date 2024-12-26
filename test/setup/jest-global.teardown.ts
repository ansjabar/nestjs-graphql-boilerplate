import { rm } from 'fs/promises';
import { join } from 'path';

module.exports = async () => {
  try {
    await rm(join(process.cwd(), './test/tmp'), { recursive: true });
  } catch (error: any) {
    console.error(`Error when tearing down. Error: ${error.message}`);
  }
};
