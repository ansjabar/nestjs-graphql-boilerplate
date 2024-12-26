import { ObjectType, InputType } from '@nestjs/graphql';
import {
  GqlRequiredEmail,
  GqlRequiredString,
} from '../../../common/validators/decorators';
import { RegisterResponseDto } from './register.dto';

@InputType()
export class LoginRequestDto {
  @GqlRequiredEmail()
  email: string;

  @GqlRequiredString()
  password: string;
}

@ObjectType()
export class LoginResponseDto extends RegisterResponseDto {}
