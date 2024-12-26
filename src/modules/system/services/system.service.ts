import { Injectable } from '@nestjs/common';
import { LocaleEntity } from '../../../common/entities/locale.entity';
import { LocaleService } from '../../../common/services/locale.service';

@Injectable()
export class SystemService {
  constructor(private readonly localeService: LocaleService) {}

  async locales(): Promise<LocaleEntity[]> {
    return this.localeService.activeLocales();
  }
}
