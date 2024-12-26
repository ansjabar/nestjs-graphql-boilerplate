import { ConflictException } from '@nestjs/common';
import { UpdateRequestDto } from '../../dtos/update.dto';
import { UserEntity } from '../../entities/user.entity';
import { AAssigner } from '../a-assigner';

export class EmailAssigner extends AAssigner {
  async assign<T extends keyof UpdateRequestDto>(
    _column: T,
    user: UserEntity,
    dto: UpdateRequestDto,
  ): Promise<UserEntity> {
    if (dto.email !== user.email) {
      if (await this.userService.findByEmail(dto.email))
        throw new ConflictException(
          this.translationService.translate('errors.email.taken'),
        );

      user.emailVerifiedAt = null;
    }
    user.email = dto.email;
    return user;
  }
}
