import {
  AdditionalArgs,
  gqlRequest,
  notificationService,
} from '../../../test/setup';
import {
  NotificationAddDto,
  NotificationFiltersDto,
  PaginationDto,
  RequiredUUIDDto,
} from '../dtos';
import { NotificationEntity } from '../entities/notification.entity';
import { randomAlphabetString } from '../helpers';

export type RequestTypes = {
  get: <T>(payload: RequiredUUIDDto) => Promise<T>;
  all: <T>(
    filters?: NotificationFiltersDto,
    pagination?: PaginationDto,
  ) => Promise<T>;
  read: <T>(payload: RequiredUUIDDto) => Promise<T>;
};

export const requests = (additionalArgs?: AdditionalArgs): RequestTypes => {
  return {
    get: async <T>(payload: RequiredUUIDDto) => {
      return await gqlRequest<T>({
        requestPath: 'notification.get',
        query: { __args: { payload }, ...gqlNotificationResponseObj },
        ...additionalArgs,
      });
    },

    all: async <T>(
      filters?: NotificationFiltersDto,
      pagination?: PaginationDto,
    ) => {
      const __args = {};
      if (filters) __args['filters'] = filters;
      if (pagination) __args['pagination'] = pagination;
      return await gqlRequest<T>({
        requestPath: 'notification.all',
        query: {
          __args,
          ...gqlNotificationResponseObj,
        },
        ...additionalArgs,
      });
    },

    read: async <T>(payload: RequiredUUIDDto) => {
      return await gqlRequest<T>({
        requestPath: 'notification.read',
        mutation: { __args: { payload } },
        ...additionalArgs,
      });
    },
  };
};

export const gqlNotificationResponseObj = {
  id: true,
  title: true,
  content: true,
  createdAt: true,
  readAt: true,
  entity: true,
  entityId: true,
  externalLink: true,
};

export const addNotification = async (
  dto: Partial<NotificationAddDto>,
): Promise<Partial<NotificationEntity>> => {
  const { id, content, title, entity, entityId, externalLink } =
    await notificationService.add({
      title: randomAlphabetString(5),
      content: randomAlphabetString(10),
      userId: dto.userId,
      ...dto,
    });

  return {
    id,
    content,
    title,
    entity: entity ?? null,
    entityId: entityId ?? null,
    externalLink: externalLink ?? null,
  };
};
