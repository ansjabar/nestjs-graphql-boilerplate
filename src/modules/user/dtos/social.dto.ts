import { UsersColumns } from '../@types';
import { UserEntity } from '../entities/user.entity';

export type GetOrCreateSocialUserType = Required<
  Pick<UserEntity, UsersColumns.EMAIL | UsersColumns.SOCIAL_LOGIN_PROVIDER>
> &
  Partial<Pick<UserEntity, UsersColumns.NAME>>;
