import { Injectable } from '@nestjs/common';
import { LocaleRepository } from '../repositories/locale.repository';

@Injectable()
export class LocaleService {
  constructor(private readonly repository: LocaleRepository) {}

  async isActive(name: string) {
    return this.repository.findOneBy({ name, active: true });
  }

  async activeLocales() {
    return this.repository.active();
  }
}
