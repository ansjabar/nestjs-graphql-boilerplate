import { InputType } from '@nestjs/graphql';
import { GqlOptionalEmail, GqlRequiredEmail } from '../validators/decorators';

@InputType()
export class EmailDto {
  @GqlRequiredEmail()
  email: string;
}

@InputType()
export class OptionalEmailDto {
  @GqlOptionalEmail()
  email?: string;
}
