import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigClass } from './config/classes';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { dataSource, initDataSource } from './database/data-source';
import Bugsnag from '@bugsnag/js';
import bugsnagPluginExpress from '@bugsnag/plugin-express';

async function bootstrap() {
  initializeTransactionalContext();

  const app = await NestFactory.create(AppModule, { abortOnError: true });

  const config = app.get(AppConfigClass);

  process.env.NODE_ENV = config.appConfigs.env;

  if (config.servicesConfigs.bugsnag.apiKey) {
    // Start the bugsnag
    Bugsnag.start({
      apiKey: config.servicesConfigs.bugsnag.apiKey,
      plugins: [bugsnagPluginExpress],
    });
  }

  await app.listen(config.appConfigs.port);

  if (Bugsnag.isStarted()) {
    // Normally GraphQL caches all errors
    // In case express caches any error, it should be reported
    const middleware = Bugsnag.getPlugin('express');
    app.use(middleware.requestHandler);
    app.use(middleware.errorHandler);
  }

  initDataSource();

  if (!dataSource.isInitialized) await dataSource.initialize();

  console.log(`Running on ${await app.getUrl()}`);
}
bootstrap();
