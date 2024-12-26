import { UserService } from '..';
import { LocaleService } from '../../../common/services/locale.service';
import { TranslationService } from '../../../common/services/translation.service';
import { FileService } from '../../file/services/file.service';
import { UpdateRequestDto } from '../dtos/update.dto';
import { IUpdater } from './@types/index.type';
import { AvatarAssigner } from './assigner-types/avatar.assigner';
import { DefaultAssigner } from './assigner-types/default.assigner';
import { EmailAssigner } from './assigner-types/email.assigner';
import { LocaleAssigner } from './assigner-types/locale.assigner';
import { PasswordAssigner } from './assigner-types/password.assigner';

export class AssignerFactory {
  constructor(
    private readonly userService: UserService,
    private readonly translationService: TranslationService,
    private readonly fileService: FileService,
    private readonly localeService: LocaleService,
  ) {}

  make<T extends keyof UpdateRequestDto>(column: T): IUpdater {
    switch (column) {
      case 'avatar':
        return this.createAssigner(AvatarAssigner);
      case 'email':
        return this.createAssigner(EmailAssigner);
      case 'locale':
        return this.createAssigner(LocaleAssigner);
      case 'password':
        return this.createAssigner(PasswordAssigner);
      default:
        return this.createAssigner(DefaultAssigner);
    }
  }

  private createAssigner<T extends IUpdater>(
    AssignerClass: new (
      userService: UserService,
      translationService: TranslationService,
      fileService: FileService,
      localeService: LocaleService,
    ) => T,
  ): T {
    return new AssignerClass(
      this.userService,
      this.translationService,
      this.fileService,
      this.localeService,
    );
  }
}
