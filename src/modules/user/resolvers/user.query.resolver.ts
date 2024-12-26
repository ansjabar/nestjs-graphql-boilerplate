import { ObjectType, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UserService } from '../services/user.service';
import { User } from '../../auth/decorators';
import { UserEntity } from '../entities/user.entity';
import { InTransaction } from '../../../utils';

@ObjectType()
class UserQuery {}

@Resolver(() => UserQuery)
export class UserQueryResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserQuery)
  @InTransaction()
  user() {
    return {};
  }

  @ResolveField(() => UserEntity)
  async profile(@User() user: UserEntity): Promise<UserEntity> {
    return await this.userService.profile(user);
  }
}
