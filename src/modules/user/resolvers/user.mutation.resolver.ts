import { UsePipes } from '@nestjs/common';
import {
  Args,
  Mutation,
  ObjectType,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { InTransaction, LowerCasePipe } from '../../../utils';
import { User } from '../../auth/decorators';
import { DeleteRequestDto } from '../dtos/delete.dto';
import { EmailVerificationRequestDto } from '../dtos/email-verify.dto';
import { UpdateRequestDto } from '../dtos/update.dto';
import { UserEntity } from '../entities/user.entity';
import { UserService } from '../services/user.service';

@ObjectType()
class UserMutation {}

@Resolver(() => UserMutation)
export class UserMutationResolver {
  constructor(
    private readonly service: UserService,
    private readonly pubSub: PubSub,
  ) {}

  @Mutation(() => UserMutation)
  @InTransaction()
  user() {
    return {};
  }

  @ResolveField(() => UserEntity)
  @UsePipes(new LowerCasePipe(['email']))
  async update(
    @User() user: UserEntity,
    @Args('payload') dto: UpdateRequestDto,
  ): Promise<UserEntity> {
    const result = await this.service.update(user, dto);

    this.pubSub.publish('userUpdated', { userUpdated: result });

    return result;
  }

  @ResolveField(() => Boolean)
  async delete(
    @User() user: UserEntity,
    @Args('payload') dto: DeleteRequestDto,
  ): Promise<boolean> {
    return await this.service.delete(user, dto);
  }

  @ResolveField(() => Boolean)
  async verifyEmail(
    @User() user: UserEntity,
    @Args('payload') dto: EmailVerificationRequestDto,
  ): Promise<boolean> {
    return await this.service.verifyEmail(user, dto);
  }

  @ResolveField(() => Boolean)
  async resendVerificationEmail(@User() user: UserEntity): Promise<boolean> {
    return await this.service.resendVerificationEmail(user);
  }
}
