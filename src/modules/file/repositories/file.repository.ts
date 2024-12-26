import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepositoryInterface } from '../../../common/interfaces';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { FileEntity } from '../entities/file.entity';

export class FileRepository
  extends BaseRepository<FileEntity>
  implements BaseRepositoryInterface<FileEntity>
{
  constructor(
    @InjectRepository(FileEntity)
    repository: Repository<FileEntity>,
  ) {
    super(repository);
  }

  async children(entity: FileEntity): Promise<FileEntity[]> {
    return await this.findManyBy({
      entityId: entity.id,
      entity: FileEntity.name,
    });
  }
}
