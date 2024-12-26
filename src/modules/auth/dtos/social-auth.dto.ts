import { InputType } from '@nestjs/graphql';
import { GqlRequiredStringIf } from '../../../common/validators/decorators';

@InputType()
export class GoogleLoginRequestDto {
  @GqlRequiredStringIf((o) => !o.code)
  token?: string;

  @GqlRequiredStringIf((o) => !o.token)
  code?: string;
}

export class SocialUserDto {
  email: string;
  name: string;
  avatarUrl?: string;
}
