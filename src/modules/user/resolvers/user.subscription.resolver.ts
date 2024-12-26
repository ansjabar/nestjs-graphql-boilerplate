import { Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { UserEntity } from '../entities/user.entity';

@Resolver()
export class UserSubscriptionResolver {
  constructor(private readonly pubSub: PubSub) {}

  @Subscription(() => UserEntity, {
    filter: (payload, variables, context) =>
      payload.userUpdated.id === context.user.id,
  })
  userUpdated() {
    return this.pubSub.asyncIterator('userUpdated');
  }
}
