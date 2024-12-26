import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsedTokenEntity } from '../entities/used-token.entity';
import { BaseRepositoryInterface } from '../interfaces';
import { BaseRepository } from './base.repository';

export class UsedTokenRepository
  extends BaseRepository<UsedTokenEntity>
  implements BaseRepositoryInterface<UsedTokenEntity>
{
  constructor(
    @InjectRepository(UsedTokenEntity)
    repository: Repository<UsedTokenEntity>,
  ) {
    super(repository);
  }
}
