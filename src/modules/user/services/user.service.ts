import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isEmpty } from 'lodash';
import { TokenTypes } from '../../../common/@types';
import { hash } from '../../../common/helpers';
import { LocaleService } from '../../../common/services/locale.service';
import { TranslationService } from '../../../common/services/translation.service';
import { UsedTokenService } from '../../../common/services/used-token.service';
import { FileTypes } from '../../file/@types/file.type';
import { FileService } from '../../file/services/file.service';
import { AuthMailService } from '../../mail/services/auth-mail.service';
import { AssignerFactory } from '../assigners/assigner.factory';
import { DeleteRequestDto } from '../dtos/delete.dto';
import { EmailVerificationRequestDto } from '../dtos/email-verify.dto';
import { GetOrCreateSocialUserType } from '../dtos/social.dto';
import { UpdateRequestDto } from '../dtos/update.dto';
import { UserEntity } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  private assignerFactory: AssignerFactory;
  constructor(
    private readonly repository: UserRepository,
    private readonly fileService: FileService,
    private readonly tokenService: UsedTokenService,
    private readonly authMailService: AuthMailService,
    private readonly translationService: TranslationService,
    localeService: LocaleService,
  ) {
    this.assignerFactory = new AssignerFactory(
      this,
      translationService,
      fileService,
      localeService,
    );
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return await this.repository.findOneBy({ email });
  }

  async findById(id: number): Promise<UserEntity> {
    return await this.repository.findOneBy({ id });
  }

  async profile(user: UserEntity | number): Promise<UserEntity> {
    if (typeof user === 'number') {
      user = await this.repository.findOneById(user);
    }

    if (!user) {
      throw new NotFoundException(
        this.translationService.translate('errors.user.notFound'),
      );
    }
    if (isEmpty(user.avatar)) {
      const [avatar] = await this.fileService.entityFile({
        entity: UserEntity.name,
        entityId: user.id,
        fileType: FileTypes.PROFILE_PICTURE,
        userId: user.id,
      });
      if (!isEmpty(avatar)) user.avatar = avatar;
    }

    return user;
  }

  async create(user: Partial<UserEntity>): Promise<UserEntity> {
    return await this.repository.createAndSave(user);
  }

  async update(user: UserEntity, dto: UpdateRequestDto): Promise<UserEntity> {
    for (const column in dto) {
      const factory = this.assignerFactory.make(
        column as keyof UpdateRequestDto,
      );

      user = await factory.assign(column as keyof UpdateRequestDto, user, dto);
    }

    await this.repository.save(user);
    return await this.profile(user.id);
  }

  async verifyEmail(
    user: UserEntity,
    dto: EmailVerificationRequestDto,
  ): Promise<boolean> {
    if (user.emailVerifiedAt)
      throw new ForbiddenException(
        this.translationService.translate('errors.email.verified'),
      );

    const tokenPayload = await this.tokenService.verify(
      dto.token,
      TokenTypes.EMAIL_VERIFY_LINK,
    );

    if (tokenPayload.userId !== user.id)
      throw new ForbiddenException(
        this.translationService.translate('errors.token.invalid'),
      );

    user.emailVerifiedAt = new Date();

    await this.repository.save(user);
    return true;
  }

  async resendVerificationEmail(user: UserEntity): Promise<boolean> {
    if (user.emailVerifiedAt)
      throw new ForbiddenException(
        this.translationService.translate('errors.email.verified'),
      );

    await this.authMailService.verification(
      user,
      this.tokenService.sign({
        payload: { userId: user.id },
        type: TokenTypes.EMAIL_VERIFY_LINK,
      }),
    );
    return true;
  }

  async delete(user: UserEntity, dto: DeleteRequestDto) {
    if (!(await hash.check({ string: dto.password, hash: user.password })))
      throw new BadRequestException(
        this.translationService.translate('errors.password.incorrect', {
          password: 'Password',
        }),
      );

    await this.repository.delete(user.id);

    return true;
  }

  async getOrCreateSocialUser(dto: GetOrCreateSocialUserType) {
    const user = await this.findByEmail(dto.email);
    if (user) return user;

    dto.name = dto?.name || dto.email;

    return await this.create(dto);
  }
}
