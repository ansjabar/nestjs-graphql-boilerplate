import { TranslationService } from '../../../common/services/translation.service';
import { FileTypes, IFileAssigner } from '../@types/file.type';
import { FileService } from '../services/file.service';
import { AFileAssigner } from './a-file.assigner';
import { DefaultAssigner } from './assigner-types/default.assigner';
import { ImageAssigner } from './assigner-types/image.assigner';

export class AssignerFactory {
  constructor(
    private readonly fileService: FileService,
    private readonly translationService: TranslationService,
  ) {}

  make(fileType: FileTypes): AFileAssigner {
    switch (fileType) {
      case FileTypes.PROFILE_PICTURE:
        return this.createAssigner(ImageAssigner);
      default:
        return this.createAssigner(DefaultAssigner);
    }
  }

  private createAssigner<T extends IFileAssigner>(
    AssignerClass: new (
      fileService: FileService,
      translationService: TranslationService,
    ) => T,
  ): T {
    return new AssignerClass(this.fileService, this.translationService);
  }
}
