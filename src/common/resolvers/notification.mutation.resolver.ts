import {
  Args,
  Mutation,
  ObjectType,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { User } from '../../modules/auth/decorators';
import { UserEntity } from '../../modules/user';
import { InTransaction } from '../../utils';
import { RequiredUUIDDto } from '../dtos';
import { NotificationService } from '../services/notification.service';

@ObjectType()
class NotificationMutation {}

@Resolver(() => NotificationMutation)
export class NotificationMutationResolver {
  constructor(private readonly service: NotificationService) {}

  @Mutation(() => NotificationMutation)
  @InTransaction()
  notification() {
    return {};
  }

  @ResolveField(() => Boolean)
  async read(
    @User() user: UserEntity,
    @Args('payload') dto: RequiredUUIDDto,
  ): Promise<boolean> {
    return await this.service.read(user, dto);
  }
}
