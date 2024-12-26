import { InputType } from '@nestjs/graphql';
import {
  Exists,
  GqlRequiredEmail,
} from '../../../common/validators/decorators';
import { UsersColumns } from '../../user/@types';
import { UserEntity } from '../../user/entities/user.entity';

@InputType()
export class PasswordForgotRequestDto {
  @GqlRequiredEmail()
  @Exists<UserEntity>({ entityName: 'userEntity', column: UsersColumns.EMAIL })
  email: string;
}
