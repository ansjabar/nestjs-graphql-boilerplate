import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { getUnixTime } from 'date-fns';
import { TranslationService } from '../../../common/services/translation.service';
import {
  MailCacheType,
  MailTypes,
  ThrottleIdentifierType,
} from '../@types/index.type';

@Injectable()
export class MailThrottleService {
  private readonly ttl = 60; // in seconds

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly translationService: TranslationService,
  ) {}

  async stopIfAlreadySent(
    mailType: MailTypes,
    identifier: ThrottleIdentifierType,
  ) {
    identifier['mailType'] = mailType;
    const key = JSON.stringify(identifier);

    const storedValue: MailCacheType = await this.cacheManager.get(key);

    if (!storedValue) {
      await this.cacheManager.set(
        key,
        { createdAt: getUnixTime(new Date()) },
        this.ttl * 1000,
      );
    } else {
      const seconds =
        this.ttl + 1 - (getUnixTime(new Date()) - storedValue.createdAt);
      throw new ForbiddenException(
        this.translationService.translate('errors.email.waitToSend', {
          seconds,
        }),
      );
    }
  }
}
