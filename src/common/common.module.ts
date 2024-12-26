import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LocaleSubscriber } from './entity-subscribers/locale.subscriber';
import { LoggingPlugin } from './plugins';

import { LocaleEntity } from './entities/locale.entity';
import { NotificationEntity } from './entities/notification.entity';
import { UsedTokenEntity } from './entities/used-token.entity';
import { LocaleRepository } from './repositories/locale.repository';
import { NotificationRepository } from './repositories/notification.repository';
import { UsedTokenRepository } from './repositories/used-token.repository';
import { NotificationMutationResolver } from './resolvers/notification.mutation.resolver';
import { NotificationQueryResolver } from './resolvers/notification.query.resolver';
import { HttpService } from './services/http.service';
import { LocaleService } from './services/locale.service';
import { NotificationService } from './services/notification.service';
import { QueueService } from './services/queue.service';
import { TranslationService } from './services/translation.service';
import { UsedTokenService } from './services/used-token.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsedTokenEntity,
      LocaleEntity,
      NotificationEntity,
    ]),
  ],
  providers: [
    UsedTokenService,
    LocaleService,
    QueueService,
    HttpService,
    NotificationService,
    LocaleRepository,
    UsedTokenRepository,
    NotificationRepository,
    NotificationQueryResolver,
    NotificationMutationResolver,
    LoggingPlugin,
    LocaleSubscriber,
    TranslationService,
  ],
  exports: [
    UsedTokenService,
    LocaleService,
    QueueService,
    HttpService,
    NotificationService,
    LocaleRepository,
    UsedTokenRepository,
    TypeOrmModule,
    TranslationService,
  ],
})
export class CommonModule {}
