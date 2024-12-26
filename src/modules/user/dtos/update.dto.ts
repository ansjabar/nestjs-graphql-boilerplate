import { InputType } from '@nestjs/graphql';
import {
  GqlOptionalEmail,
  GqlOptionalNumber,
  GqlOptionalString,
  GqlRequiredString,
  Length,
} from '../../../common/validators/decorators';
@InputType()
export class UpdateRequestDto {
  @GqlOptionalString()
  name?: string;

  @GqlOptionalEmail()
  email?: string;

  @GqlOptionalNumber()
  avatar?: number;

  @GqlOptionalString()
  @Length(2, 2)
  locale?: string;

  oldPassword?: string;

  password?: string;

  loggedOutAt?: string;
}

@InputType()
export class ChangePasswordRequestDto {
  @GqlRequiredString()
  oldPassword?: string;

  @GqlRequiredString()
  newPassword?: string;
}
