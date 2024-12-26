import { Injectable } from '@nestjs/common';
import { TokenTypes } from '../../../common/@types';
import { UsedTokenService } from '../../../common/services/used-token.service';
import { AuthMailService } from '../../mail/services/auth-mail.service';
import { UserService } from '../../user/services/user.service';
import { PasswordForgotRequestDto, PasswordResetRequestDto } from '../dtos';

@Injectable()
export class PasswordService {
  constructor(
    private readonly userService: UserService,
    private readonly authMailService: AuthMailService,
    private readonly tokenService: UsedTokenService,
  ) {}

  async forgot(dto: PasswordForgotRequestDto): Promise<boolean> {
    const user = await this.userService.findByEmail(dto.email);

    const token = this.tokenService.sign({
      payload: { userId: user.id },
      type: TokenTypes.PASSWORD_RESET_LINK,
    });

    await this.authMailService.passwordForgot(user, token);
    return true;
  }

  async reset(dto: PasswordResetRequestDto): Promise<boolean> {
    const tokenPayload = await this.tokenService.verify(
      dto.token,
      TokenTypes.PASSWORD_RESET_LINK,
    );

    const user = await this.userService.findById(tokenPayload.userId);

    await this.userService.update(user, {
      password: dto.password,
      loggedOutAt: `${new Date().getTime()}`,
    });

    return true;
  }
}
