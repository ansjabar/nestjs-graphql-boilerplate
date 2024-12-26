import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepositoryInterface } from '../../../common/interfaces';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { AccessTokenEntity } from '../entities/access-token.entity';

export class AccessTokenRepository
  extends BaseRepository<AccessTokenEntity>
  implements BaseRepositoryInterface<AccessTokenEntity>
{
  constructor(
    @InjectRepository(AccessTokenEntity)
    repository: Repository<AccessTokenEntity>,
  ) {
    super(repository);
  }
}
