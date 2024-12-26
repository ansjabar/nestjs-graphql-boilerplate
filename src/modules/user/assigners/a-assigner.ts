import { UserService } from '..';
import { LocaleService } from '../../../common/services/locale.service';
import { TranslationService } from '../../../common/services/translation.service';
import { FileService } from '../../file/services/file.service';
import { UpdateRequestDto } from '../dtos/update.dto';
import { UserEntity } from '../entities/user.entity';
import { IUpdater } from './@types/index.type';

export abstract class AAssigner implements IUpdater {
  constructor(
    protected readonly userService: UserService,
    protected readonly translationService: TranslationService,
    protected readonly fileService: FileService,
    protected readonly localeService: LocaleService,
  ) {}
  assign<T extends keyof UpdateRequestDto>(
    column: T,
    user: UserEntity,
    dto: UpdateRequestDto,
  ): Promise<UserEntity> | UserEntity {
    user[column as string] = dto[column];
    return user;
  }
}
