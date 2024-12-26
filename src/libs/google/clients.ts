import { google } from 'googleapis';
import { GoogleAuthConfigOptions } from '../../config/@types';

export const oauth2Client = (config: GoogleAuthConfigOptions): any => {
  return new google.auth.OAuth2(
    config.clientId,
    config.clientSecret,
    config.redirectUrl,
  );
};
