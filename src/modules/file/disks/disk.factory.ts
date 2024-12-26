import { DriverType } from '@codebrew/nestjs-storage';
import { NotFoundException } from '@nestjs/common';
import { TranslationService } from '../../../common/services/translation.service';
import { IDisk } from '../@types';
import { ADisk } from './a.disk';
import { LocalDisk } from './disk-types/local.disk';

export class DiskFactory {
  constructor(private readonly translationService: TranslationService) {}

  make(disk: DriverType): ADisk {
    switch (disk) {
      case DriverType.LOCAL:
        return this.createAssigner(LocalDisk);
      default:
        throw new NotFoundException(
          this.translationService.translate('errors.disk.notCOnfigured', {
            disk,
          }),
        );
    }
  }

  private createAssigner<T extends IDisk>(AssignerClass: new () => T): T {
    return new AssignerClass();
  }
}
