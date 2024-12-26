import { configs } from './config-types/index';
import { ConfigModule } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';
import { AppConfigClass } from './classes';
import { validate } from './../config/validators';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'test' ? ['.env.test'] : ['.env'],
      load: configs,
      isGlobal: true,
      validate,
    }),
  ],
  providers: [AppConfigClass],
  exports: [ConfigModule, AppConfigClass],
})
export class AppConfigModule {}
