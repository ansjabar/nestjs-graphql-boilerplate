import { MailerOptions, MailerOptionsFactory } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { join } from 'path';
import { MailConfigOptions } from '../@types';
import { AppConfigClass } from './app-config.class';

@Injectable()
export class MailModuleClass implements MailerOptionsFactory {
  constructor(
    private readonly configs: AppConfigClass,
    private readonly i18n: I18nService,
  ) {}

  createMailerOptions(): MailerOptions | Promise<MailerOptions> {
    const mailConfigs: MailConfigOptions = this.configs.mailConfigs;

    return {
      transport: {
        ...(mailConfigs.mailer.toLowerCase() === 'sendmail'
          ? { sendmail: true, newline: 'unix', path: mailConfigs.sendMailPath }
          : {}),
        host: mailConfigs.host,
        secure:
          mailConfigs.encryption &&
          mailConfigs.encryption.toLowerCase() === 'ssl',
        mailer: mailConfigs.mailer as any,
        from: `"No Reply" <${mailConfigs.from}>`,
        auth: {
          user: mailConfigs.username,
          pass: mailConfigs.password,
        },
      },
      template: {
        dir: join(__dirname, './../../modules/mail/templates'),
        adapter: new HandlebarsAdapter({
          trans: (key: string, context?: any): string => {
            const args = context.data.root;
            return this.i18n.t(key, {
              args,
              ...(args.locale ? { lang: args.locale } : {}),
            });
          },
        }),
        options: {
          strict: true,
        },
      },
      options: {
        partials: {
          dir: join(__dirname, './../../modules/mail/templates/partials'),
        },
      },
    };
  }
}
