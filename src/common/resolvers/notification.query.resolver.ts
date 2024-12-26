import {
  Args,
  ObjectType,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { User } from '../../modules/auth/decorators';
import { UserEntity } from '../../modules/user';
import { InTransaction } from '../../utils';
import {
  NotificationFiltersDto,
  PaginationDto,
  RequiredUUIDDto,
} from '../dtos';
import { NotificationEntity } from '../entities/notification.entity';
import { NotificationService } from '../services/notification.service';

@ObjectType()
class NotificationQuery {}

@Resolver(() => NotificationQuery)
export class NotificationQueryResolver {
  constructor(private service: NotificationService) {}

  @Query(() => NotificationQuery)
  @InTransaction()
  notification() {
    return {};
  }

  @ResolveField(() => NotificationEntity)
  async get(
    @User() user: UserEntity,
    @Args('payload') dto: RequiredUUIDDto,
  ): Promise<NotificationEntity> {
    return await this.service.get(user, dto);
  }

  @ResolveField(() => [NotificationEntity])
  async all(
    @User() user: UserEntity,
    @Args('filters', { nullable: true }) filters?: NotificationFiltersDto,
    @Args('pagination', { nullable: true }) pagination?: PaginationDto,
  ): Promise<NotificationEntity[]> {
    return await this.service.all(user, filters, pagination);
  }
}
