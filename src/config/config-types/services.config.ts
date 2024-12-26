import { registerAs } from '@nestjs/config';
import { ServicesConfigOptions } from '../@types';

/**
 * Environment configurations related to 'third party services'
 */
export default registerAs('services', (): ServicesConfigOptions => {
  return {
    bugsnag: {
      apiKey: process.env.BUGSNAG_API_KEY,
      releaseStage: process.env.BUGSNAG_RELEASE_STAGE
        ? process.env.BUGSNAG_RELEASE_STAGE
        : process.env.APP_ENV,
    },
  };
});
