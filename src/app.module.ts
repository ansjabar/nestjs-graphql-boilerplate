import {
  BullModuleClass,
  GqlModuleClass,
  I18nModuleClass,
  ServerModuleClass,
  StorageModuleClass,
  TypeormModuleClass,
  ThrottlerModuleClass,
} from './config/classes';
import { DataSource } from 'typeorm';
import { I18nModule } from 'nestjs-i18n';
import { BullModule } from '@nestjs/bull';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { graphqlUploadExpress } from 'graphql-upload';
import { CommonModule } from './common/common.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './modules/mail/mail.module';
import { StorageModule } from '@codebrew/nestjs-storage';
import { ServeStaticModule } from '@nestjs/serve-static';
import { FileModule } from './modules/file/file.module';
import { AppConfigModule } from './config/app.config.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { AccessTokenGuard } from './modules/auth/guards';
import { SystemModule } from './modules/system/system.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { GqlThrottlerGuard } from './common/guards/gql-throttler.guard';

@Module({
  imports: [
    AppConfigModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useClass: GqlModuleClass,
    }),
    CacheModule.register({ isGlobal: true }),
    ScheduleModule.forRoot(),
    I18nModule.forRootAsync(I18nModuleClass.options()),
    BullModule.forRootAsync({ useClass: BullModuleClass }),
    TypeOrmModule.forRootAsync({
      useClass: TypeormModuleClass,
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Invalid options passed');
        }

        return addTransactionalDataSource(new DataSource(options));
      },
    }),
    StorageModule.forRootAsync({ useClass: StorageModuleClass }),
    ServeStaticModule.forRootAsync({ useClass: ServerModuleClass }),
    BullBoardModule.forRoot({ route: '/queues', adapter: ExpressAdapter }),
    ThrottlerModule.forRootAsync({ useClass: ThrottlerModuleClass }),
    UserModule,
    AuthModule,
    MailModule,
    FileModule,
    CommonModule,
    SystemModule,
  ],

  providers: [
    { provide: APP_GUARD, useClass: AccessTokenGuard },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    { provide: APP_GUARD, useClass: GqlThrottlerGuard },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(graphqlUploadExpress()).forRoutes('graphql');
  }
}
