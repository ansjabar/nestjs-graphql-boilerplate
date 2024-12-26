import { Inject, Injectable } from '@nestjs/common';
import { QueueService } from '../../../common/services/queue.service';
import { TranslationService } from '../../../common/services/translation.service';
import { AppConfigClass } from '../../../config/classes';
import {
  MailQueueType,
  MailTypes,
  ThrottleIdentifierType,
} from '../@types/index.type';
import { MailThrottleService } from './mail-throttle.service';

@Injectable()
export class MailService {
  @Inject(AppConfigClass)
  protected readonly configs: AppConfigClass;

  @Inject(QueueService)
  private readonly queueService: QueueService;

  @Inject(MailThrottleService)
  private readonly mailThrottleService: MailThrottleService;

  @Inject(TranslationService)
  protected readonly translationService: TranslationService;

  protected async enqueue(
    mailType: MailTypes,
    throttleIdentifier: ThrottleIdentifierType,
    data: MailQueueType,
  ): Promise<void> {
    await this.mailThrottleService.stopIfAlreadySent(
      mailType,
      throttleIdentifier,
    );

    data.context['year'] = new Date().getFullYear();
    data.context['appName'] = this.configs.appConfigs.name;
    this.queueService.enqueueMail(data);
  }
}
