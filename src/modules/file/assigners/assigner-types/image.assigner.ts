import { Injectable, UnsupportedMediaTypeException } from '@nestjs/common';
import { isImage } from '../../../../common/helpers';
import { AFileAssigner } from '../a-file.assigner';

@Injectable()
export class ImageAssigner extends AFileAssigner {
  verifyMimeType(mimeType: string): void {
    if (!isImage(mimeType))
      throw new UnsupportedMediaTypeException(
        this.translationService.translate('errors.file.mimeConflictOnAssign', {
          fromType: mimeType,
          toType: 'image',
        }),
      );
  }
}
