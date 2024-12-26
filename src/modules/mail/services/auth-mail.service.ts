import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../user/entities/user.entity';
import { MailTypes } from '../@types/index.type';
import { MailService } from './mail.service';

@Injectable()
export class AuthMailService extends MailService {
  async welcome(user: UserEntity, token: string) {
    const link = `${this.configs.appConfigs.url}?token=${token}`;
    await this.enqueue(
      MailTypes.USER_WELCOME,
      { userId: user.id, email: user.email },
      {
        to: user.email,
        subject: this.translationService.translate('emails.welcome.subject', {
          appName: this.configs.appConfigs.name,
        }),
        template: './welcome',
        context: { name: user.firstName, link },
      },
    );
  }

  async passwordForgot(user: UserEntity, token: string) {
    const link = `${this.configs.appConfigs.url}?token=${token}`;

    await this.enqueue(
      MailTypes.PASSWORD_FORGOT,
      { userId: user.id },
      {
        to: user.email,
        subject: this.translationService.translate(
          'emails.passwordForget.subject',
        ),
        template: './password-forget',
        context: { name: user.firstName, link },
      },
    );
  }

  async verification(user: UserEntity, token: string) {
    const link = `${this.configs.appConfigs.url}?token=${token}`;

    await this.enqueue(
      MailTypes.ACCOUNT_VERIFICATION,
      { userId: user.id },
      {
        to: user.email,
        subject: this.translationService.translate(
          'emails.verification.subject',
        ),
        template: './email-verification',
        context: { name: user.firstName, link },
      },
    );
  }
}
