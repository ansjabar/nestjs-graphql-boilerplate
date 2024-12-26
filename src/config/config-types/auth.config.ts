import { registerAs } from '@nestjs/config';
import { AuthConfigOptions } from '../@types';

export default registerAs(
  'auth',
  (): AuthConfigOptions => ({
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUrl: process.env.GOOGLE_REDIRECT_URL,
    },
    accessToken: {
      expiry: parseInt(process.env.ACCESS_TOKEN_EXPIRY, 10) || 10080, // in minutes
    },
  }),
);
