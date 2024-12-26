import { registerAs } from '@nestjs/config';
import { MailConfigOptions } from '../@types';

/**
 * Environment configurations related to 'mail'
 */
export default registerAs('mail', (): MailConfigOptions => {
  return {
    host: process.env.MAIL_HOST,
    mailer: process.env.MAIL_MAILER,
    encryption: process.env.MAIL_ENCRYPTION,
    from: process.env.MAIL_FROM,
    port: parseInt(process.env.MAIL_PORT, 10) || 2525,
    username: process.env.MAIL_USERNAME,
    password: process.env.MAIL_PASSWORD,
    sendMailPath: process.env.MAIL_SENDMAIL_PATH || '/usr/sbin/sendmail',
    disabled: process.env.MAIL_DISABLE_EMAILS
      ? process.env.MAIL_DISABLE_EMAILS === 'true'
        ? true
        : false
      : false,
  };
});
