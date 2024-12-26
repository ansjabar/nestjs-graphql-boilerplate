import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  GqlRequiredEmail,
  GqlRequiredString,
  MinLength,
  NotExists,
  Password,
} from '../../../common/validators/decorators';
import { UsersColumns } from '../../user/@types';
import { UserEntity } from '../../user/entities/user.entity';
@InputType()
export class RegisterRequestDto {
  @GqlRequiredEmail()
  @NotExists<UserEntity>({
    entityName: 'userEntity',
    column: UsersColumns.EMAIL,
  })
  email: string;

  @GqlRequiredString()
  @MinLength(3)
  name: string;

  @GqlRequiredString()
  @Password()
  password: string;
}

@ObjectType()
export class TokenResponseDto {
  @Field()
  token: string;

  @Field()
  expiresAt: number;
}

@ObjectType()
export class RegisterResponseDto {
  @Field(() => TokenResponseDto)
  accessToken: TokenResponseDto;

  @Field(() => UserEntity)
  user: UserEntity;
}
