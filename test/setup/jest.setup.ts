import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { AppModule } from '../../src/app.module';
import { HttpService } from '../../src/common/services/http.service';
import { NotificationService } from '../../src/common/services/notification.service';
import { QueueService } from '../../src/common/services/queue.service';
import { TranslationService } from '../../src/common/services/translation.service';
import { UsedTokenService } from '../../src/common/services/used-token.service';
import { dataSource, initDataSource } from '../../src/database/data-source';
import { GoogleAuth } from '../../src/modules/auth/social-auth';
import { FileService } from '../../src/modules/file/services/file.service';
import { QueueServiceMock } from '../mocks/queue.service.mock';

let app: INestApplication,
  moduleFixture: TestingModule,
  tokenService: UsedTokenService,
  fileService: FileService,
  httpService: HttpService,
  notificationService: NotificationService,
  translationService: TranslationService,
  googleAuth: GoogleAuth;

beforeAll(async () => {
  initializeTransactionalContext();

  moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(QueueService)
    .useClass(QueueServiceMock)
    .compile();

  app = moduleFixture.createNestApplication();

  await app.init();

  initDataSource();

  if (!dataSource.isInitialized) await dataSource.initialize();

  tokenService = moduleFixture.get<UsedTokenService>(UsedTokenService);
  fileService = moduleFixture.get<FileService>(FileService);
  httpService = moduleFixture.get<HttpService>(HttpService);
  notificationService =
    moduleFixture.get<NotificationService>(NotificationService);
  translationService =
    moduleFixture.get<TranslationService>(TranslationService);
  googleAuth = moduleFixture.get<GoogleAuth>(GoogleAuth);
});

afterAll(async () => {
  await app.close();
});

export {
  app,
  fileService,
  googleAuth,
  httpService,
  moduleFixture,
  notificationService,
  tokenService,
  translationService
};

