import { Injectable } from '@nestjs/common';
import { HttpService } from '../../../common/services/http.service';
import { AppConfigClass } from '../../../config/classes';
import { FileService } from '../../file/services/file.service';
import { SocialLoginProviders } from '../../user/@types/social.type';
import { UserEntity } from '../../user/entities/user.entity';
import { UserService } from '../../user/services/user.service';
import { SocialUserDto } from '../dtos';
import { AuthService } from '../services/auth.service';

@Injectable()
export abstract class AAuth {
  protected abstract provider: SocialLoginProviders;

  constructor(
    protected readonly userService: UserService,
    protected readonly authService: AuthService,
    protected readonly configs: AppConfigClass,
    protected readonly httpService: HttpService,
    private readonly fileService: FileService,
  ) {}

  protected abstract user(dto: unknown): Promise<SocialUserDto>;
  protected abstract parseAvatarUrl(url: string): string;

  async authenticate(dto: unknown) {
    const socialUser = await this.user(dto);

    const user = await this.userService.getOrCreateSocialUser({
      name: socialUser.name,
      email: socialUser.email,
      socialLoginProvider: this.provider,
    });

    if (socialUser.avatarUrl) {
      await this.assignAvatar(this.parseAvatarUrl(socialUser.avatarUrl), user);
    }

    return this.authService.authResponse(user);
  }

  private async assignAvatar(avatarUrl: string, user: UserEntity) {
    const fileEntity = await this.fileService.uploadFromUrl(avatarUrl, user);
    await this.userService.update(user, { avatar: fileEntity.id });
  }
}
