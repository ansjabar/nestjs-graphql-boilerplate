import { BadRequestException } from '@nestjs/common';
import { hash } from '../../../../common/helpers';
import { UpdateRequestDto } from '../../dtos/update.dto';
import { UserEntity } from '../../entities/user.entity';
import { AAssigner } from '../a-assigner';

export class PasswordAssigner extends AAssigner {
  async assign<T extends keyof UpdateRequestDto>(
    _column: T,
    user: UserEntity,
    dto: UpdateRequestDto,
  ): Promise<UserEntity> {
    if (dto.oldPassword) {
      if (dto.oldPassword === dto.password) {
        throw new BadRequestException(
          this.translationService.translate('errors.password.cannotBeSame'),
        );
      }

      if (
        !(await hash.check({ string: dto.oldPassword, hash: user.password }))
      ) {
        throw new BadRequestException(
          this.translationService.translate('errors.password.incorrect', {
            field: 'Old password',
          }),
        );
      }
    }

    user.password = await hash.make(dto.password);
    return user;
  }
}
