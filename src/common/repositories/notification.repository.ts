import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { UserEntity } from '../../modules/user';
import {
  NotificationFiltersDto,
  PaginationDto,
  RequiredUUIDDto,
} from '../dtos';
import { NotificationEntity } from '../entities/notification.entity';
import { now, paginate } from '../helpers';
import { BaseRepositoryInterface } from '../interfaces';
import { BaseRepository } from './/base.repository';

export class NotificationRepository
  extends BaseRepository<NotificationEntity>
  implements BaseRepositoryInterface<NotificationEntity>
{
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly repository: Repository<NotificationEntity>,
  ) {
    super(repository);
  }

  async get(
    dto: RequiredUUIDDto,
    user: UserEntity,
  ): Promise<NotificationEntity> {
    return this.findOne({
      where: {
        ...dto,
        userId: user.id,
      },
    });
  }

  async all(
    user: UserEntity,
    filters: NotificationFiltersDto,
    pagination: PaginationDto,
  ): Promise<NotificationEntity[]> {
    return this.findMany({
      where: {
        userId: user.id,
        ...(filters?.read ? { readAt: Not(IsNull()) } : {}),
        ...(filters?.read === false ? { readAt: IsNull() } : {}),
      },
      ...paginate(pagination),
    });
  }

  async read(user: UserEntity, dto: RequiredUUIDDto) {
    this.update(
      { userId: user.id, ...dto, readAt: IsNull() },
      {
        readAt: now(),
      },
    );
  }
}
