import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocaleEntity } from '../entities/locale.entity';
import { BaseRepositoryInterface } from '../interfaces';
import { BaseRepository } from './/base.repository';

export class LocaleRepository
  extends BaseRepository<LocaleEntity>
  implements BaseRepositoryInterface<LocaleEntity>
{
  constructor(
    @InjectRepository(LocaleEntity)
    private readonly repository: Repository<LocaleEntity>,
  ) {
    super(repository);
  }

  async active(): Promise<LocaleEntity[]> {
    return this.findManyBy({ active: true });
  }
}
