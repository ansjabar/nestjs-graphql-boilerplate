import { UsePipes } from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  ObjectType,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { GqlContext } from '../../../common/@types';
import { InTransaction, LowerCasePipe } from '../../../utils';
import { UserEntity } from '../../user';
import { ChangePasswordRequestDto } from '../../user/dtos/update.dto';
import { PublicResolver, User } from '../decorators';
import {
  GoogleLoginRequestDto,
  LoginRequestDto,
  LoginResponseDto,
  PasswordForgotRequestDto,
  PasswordResetRequestDto,
  RegisterRequestDto,
  RegisterResponseDto,
} from '../dtos';
import { LogoutRequestDto } from '../dtos/logout.dto';
import { AuthService } from '../services/auth.service';
import { PasswordService } from '../services/password.service';
import { GoogleAuth } from './../social-auth';

@ObjectType()
class AuthMutation {}

@Resolver(() => AuthMutation)
@PublicResolver([
  'login',
  'register',
  'forgotPassword',
  'resetPassword',
  'loginWithGoogle',
])
export class AuthMutationResolver {
  constructor(
    private authService: AuthService,
    private readonly passwordService: PasswordService,
    private readonly googleAuth: GoogleAuth,
  ) {}

  @Mutation(() => AuthMutation)
  @InTransaction()
  auth() {
    return {};
  }

  @ResolveField(() => LoginResponseDto)
  async login(
    @Args('payload') payload: LoginRequestDto,
  ): Promise<LoginResponseDto> {
    return await this.authService.login(payload);
  }

  @ResolveField(() => LoginResponseDto)
  async loginWithGoogle(
    @Args('payload') payload: GoogleLoginRequestDto,
  ): Promise<LoginResponseDto> {
    return await this.googleAuth.authenticate(payload);
  }

  @ResolveField(() => RegisterResponseDto)
  @UsePipes(new LowerCasePipe(['email']))
  async register(
    @Args('payload') payload: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    return await this.authService.register(payload);
  }

  @ResolveField(() => Boolean)
  async forgotPassword(
    @Args('payload') payload: PasswordForgotRequestDto,
  ): Promise<boolean> {
    return await this.passwordService.forgot(payload);
  }

  @ResolveField(() => Boolean)
  async resetPassword(
    @Args('payload') payload: PasswordResetRequestDto,
  ): Promise<boolean> {
    return await this.passwordService.reset(payload);
  }

  @ResolveField(() => Boolean)
  async changePassword(
    @User() user: UserEntity,
    @Context() context: GqlContext,
    @Args('payload') payload: ChangePasswordRequestDto,
  ): Promise<boolean> {
    await this.authService.changePassword(user, context, payload);
    return true;
  }

  @ResolveField(() => Boolean)
  async logout(
    @User() user: UserEntity,
    @Context() context: GqlContext,
    @Args('filters') filters: LogoutRequestDto,
  ): Promise<boolean> {
    return await this.authService.logout(user, context, filters);
  }
}
