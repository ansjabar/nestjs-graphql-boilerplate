import { UpdateRequestDto } from '../../dtos/update.dto';
import { UserEntity } from '../../entities/user.entity';

export interface IUpdater {
  assign<T extends keyof UpdateRequestDto>(
    column: T,
    user: UserEntity,
    dto: UpdateRequestDto,
  ): Promise<UserEntity> | UserEntity;
}
