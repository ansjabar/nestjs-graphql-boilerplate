import { ModuleRef } from '@nestjs/core';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
} from 'typeorm';
import { LocaleEntity } from '../entities/locale.entity';
import { TranslationService } from '../services/translation.service';

@EventSubscriber()
export class LocaleSubscriber
  implements EntitySubscriberInterface<LocaleEntity>
{
  private translationService: TranslationService;

  constructor(dataSource: DataSource, private readonly moduleRef: ModuleRef) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return LocaleEntity;
  }

  afterLoad(entity: LocaleEntity) {
    if (!this.translationService) {
      this.translationService = this.moduleRef.get(TranslationService, {
        strict: false,
      });
    }

    entity.title = this.translationService.translate(entity.title);
  }
}
