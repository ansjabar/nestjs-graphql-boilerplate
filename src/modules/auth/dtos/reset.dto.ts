import { InputType } from '@nestjs/graphql';
import {
  GqlRequiredString,
  Password,
} from '../../../common/validators/decorators';

@InputType()
export class PasswordResetRequestDto {
  @GqlRequiredString()
  token: string;

  @GqlRequiredString()
  @Password()
  password: string;
}
