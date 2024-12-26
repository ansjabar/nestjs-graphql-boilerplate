import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { TranslationService } from '../../../../common/services/translation.service';
import { FileService } from '../../services/file.service';
import { AFileAssigner } from '../a-file.assigner';

@Injectable()
export class DefaultAssigner extends AFileAssigner {
  constructor(
    @Inject(forwardRef(() => FileService))
    fileService: FileService,
    translationService: TranslationService,
  ) {
    super(fileService, translationService);
  }

  verifyMimeType(): void {
    return;
  }
}
