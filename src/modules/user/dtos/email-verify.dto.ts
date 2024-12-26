import { InputType } from '@nestjs/graphql';
import { GqlRequiredString } from '../../../common/validators/decorators';
@InputType()
export class EmailVerificationRequestDto {
  @GqlRequiredString()
  token: string;
}
