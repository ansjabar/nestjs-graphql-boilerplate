import { InputType } from '@nestjs/graphql';
import { NotificationsColumns } from '../@types';
import { NotificationEntity } from '../entities/notification.entity';
import { GqlOptionalBoolean } from '../validators';

@InputType()
export class NotificationFiltersDto {
  @GqlOptionalBoolean()
  read?: boolean;
}

export type NotificationAddDto = Pick<
  NotificationEntity,
  | NotificationsColumns.TITLE
  | NotificationsColumns.CONTENT
  | NotificationsColumns.ENTITY
  | NotificationsColumns.USER_ID
  | NotificationsColumns.ENTITY_ID
  | NotificationsColumns.EXTERNAL_LINK
>;
