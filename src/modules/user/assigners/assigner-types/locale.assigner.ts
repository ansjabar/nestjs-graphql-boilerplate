import { ConflictException } from '@nestjs/common';
import { UpdateRequestDto } from '../../dtos/update.dto';
import { UserEntity } from '../../entities/user.entity';
import { AAssigner } from '../a-assigner';

export class LocaleAssigner extends AAssigner {
  async assign<T extends keyof UpdateRequestDto>(
    _column: T,
    user: UserEntity,
    dto: UpdateRequestDto,
  ): Promise<UserEntity> {
    if (
      dto.locale !== user.locale &&
      !(await this.localeService.isActive(dto.locale))
    ) {
      throw new ConflictException(
        this.translationService.translate('errors.locale.notAvailable', {
          locale: dto.locale,
        }),
      );
    }

    user.locale = dto.locale;
    return user;
  }
}
