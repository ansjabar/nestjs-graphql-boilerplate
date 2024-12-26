import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepositoryInterface } from '../../../common/interfaces';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { UserEntity } from '../entities/user.entity';

export class UserRepository
  extends BaseRepository<UserEntity>
  implements BaseRepositoryInterface<UserEntity>
{
  constructor(
    @InjectRepository(UserEntity)
    repository: Repository<UserEntity>,
  ) {
    super(repository);
  }
}
