import { MailerModule } from '@nestjs-modules/mailer';
import { Global, Module } from '@nestjs/common';
import { AuthMailService } from './services/auth-mail.service';
import { BullModule } from '@nestjs/bull';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { MailProcessor } from './processors/mail.processor';
import { MailModuleClass } from '../../config/classes';
import { MailThrottleService } from './services/mail-throttle.service';
import { MailService } from './services/mail.service';
@Global()
@Module({
  imports: [
    BullModule.registerQueue({ name: 'mail' }),

    BullBoardModule.forFeature({ name: 'mail', adapter: BullAdapter }),
    MailerModule.forRootAsync({
      useClass: MailModuleClass,
    }),
  ],
  providers: [
    AuthMailService,
    BullModule,
    MailThrottleService,
    MailProcessor,
    MailService,
  ],
  exports: [AuthMailService, BullModule],
})
export class MailModule {}
