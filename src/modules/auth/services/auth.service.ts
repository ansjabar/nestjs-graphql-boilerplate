import { Injectable, UnauthorizedException } from '@nestjs/common';
import { GqlContext, TokenTypes } from '../../../common/@types';
import { EmailDto } from '../../../common/dtos';
import { extractTokenFromContext, hash } from '../../../common/helpers';
import { TranslationService } from '../../../common/services/translation.service';
import { UsedTokenService } from '../../../common/services/used-token.service';
import { AppConfigClass } from '../../../config/classes';
import { AuthMailService } from '../../mail/services/auth-mail.service';
import { ChangePasswordRequestDto } from '../../user/dtos/update.dto';
import { UserEntity } from '../../user/entities/user.entity';
import { UserService } from '../../user/services/user.service';
import { LogoutDeviceTypes } from '../@types';
import {
  LoginRequestDto,
  LoginResponseDto,
  RegisterRequestDto,
  RegisterResponseDto,
  TokenResponseDto,
} from '../dtos';
import { LogoutRequestDto } from '../dtos/logout.dto';
import { AccessTokenService } from './access-token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly authMailService: AuthMailService,
    private readonly tokenService: UsedTokenService,
    private readonly configs: AppConfigClass,
    private readonly translationService: TranslationService,
    private readonly accessTokenService: AccessTokenService,
  ) {}

  /**
   * Attempt to login user, if not authenticated, throw error
   * @param {LoginRequestDto} dto
   * @returns {Promise<LoginResponseDto>}
   */
  async login(dto: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.userService.findByEmail(dto.email);
    if (
      !user ||
      !(await hash.check({ string: dto.password, hash: user.password }))
    )
      throw new UnauthorizedException(
        this.translationService.translate('errors.auth.invalidCreds'),
      );
    return this.authResponse(user);
  }

  /**
   * Register a new user to system
   * @param {RegisterRequestDto} dto
   * @returns {Promise<RegisterResponseDto>}
   */
  async register(dto: RegisterRequestDto): Promise<RegisterResponseDto> {
    const password = await hash.make(dto.password);

    const newUser = await this.userService.findById(
      (
        await this.userService.create({ ...dto, password })
      ).id,
    );

    await this.authMailService.welcome(
      newUser,
      this.tokenService.sign({
        payload: { userId: newUser.id },
        type: TokenTypes.EMAIL_VERIFY_LINK,
      }),
    );

    return this.authResponse(newUser);
  }

  private async accessTokenResponse(userId: number): Promise<TokenResponseDto> {
    const accessToken = await this.accessTokenService.create(userId);
    return {
      token: accessToken.token,
      expiresAt: accessToken.expiresAt,
    };
  }

  async authResponse(user: UserEntity): Promise<LoginResponseDto> {
    return {
      accessToken: await this.accessTokenResponse(user.id),
      user,
    };
  }

  async isRegistered(dto: EmailDto): Promise<boolean> {
    const user = await this.userService.findByEmail(dto.email);
    if (!user || !user.password) return false;
    return true;
  }

  async changePassword(
    user: UserEntity,
    context: GqlContext,
    payload: ChangePasswordRequestDto,
  ) {
    await this.userService.update(user, {
      oldPassword: payload.oldPassword,
      password: payload.newPassword,
    });

    const token = extractTokenFromContext(context);
    await this.accessTokenService.logoutAllTokenExceptToken(token);
  }

  async logout(
    user: UserEntity,
    context: GqlContext,
    filters: LogoutRequestDto,
  ): Promise<boolean> {
    if (filters.device === LogoutDeviceTypes.ALL) {
      await this.accessTokenService.logoutAllTokens(user.id);
    } else {
      const token = extractTokenFromContext(context);

      await this.accessTokenService.logoutToken(token);
    }

    return true;
  }
}
