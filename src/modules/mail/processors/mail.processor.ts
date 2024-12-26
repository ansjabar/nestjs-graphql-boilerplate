// mail.processor.ts

import { Processor, Process } from '@nestjs/bull';
import { MailerService } from '@nestjs-modules/mailer';
import { Job } from 'bull';
import { MailQueueType } from '../@types/index.type';

@Processor('mail')
export class MailProcessor {
  constructor(private readonly mailerService: MailerService) {}

  @Process('send')
  async send(job: Job<MailQueueType>) {
    const { to, subject, template, context } = job.data;

    return await this.mailerService.sendMail({
      to,
      subject,
      template,
      context,
    });
  }
}
