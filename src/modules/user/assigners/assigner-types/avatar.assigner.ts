import { FileTypes } from '../../../file/@types/file.type';
import { UpdateRequestDto } from '../../dtos/update.dto';
import { UserEntity } from '../../entities/user.entity';
import { AAssigner } from '../a-assigner';

export class AvatarAssigner extends AAssigner {
  async assign<T extends keyof UpdateRequestDto>(
    _column: T,
    user: UserEntity,
    dto: UpdateRequestDto,
  ): Promise<UserEntity> {
    let oldAvatar: number;

    if (user.avatar && user.avatar.id === dto.avatar) return user;
    else if (user.avatar && user.avatar.id) {
      oldAvatar = user.avatar.id;
    }

    await this.fileService.assignSingle({
      entity: UserEntity.name,
      entityId: user.id,
      fileType: FileTypes.PROFILE_PICTURE,
      userId: user.id,
      newFileId: dto.avatar,
      oldFileId: oldAvatar,
    });

    return user;
  }
}
