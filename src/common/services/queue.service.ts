import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { AppConfigClass } from '../../config/classes';
import { MailQueueType } from '../../modules/mail/@types/index.type';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('mail') private mailQueue: Queue,
    private readonly configs: AppConfigClass,
  ) {}

  async enqueueMail(data: MailQueueType): Promise<Job<MailQueueType>> {
    if (this.configs.mailConfigs.disabled) return;
    return await this.mailQueue.add('send', data);
  }
}
