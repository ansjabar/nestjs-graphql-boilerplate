import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PubSub } from 'graphql-subscriptions';
import { CommonModule } from '../../common/common.module';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { UserMutationResolver } from './resolvers/user.mutation.resolver';
import { UserQueryResolver } from './resolvers/user.query.resolver';
import { UserSubscriptionResolver } from './resolvers/user.subscription.resolver';
import { UserService } from './services/user.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), CommonModule],
  providers: [
    UserService,
    UserMutationResolver,
    UserQueryResolver,
    UserSubscriptionResolver,
    UserRepository,
    PubSub,
  ],
  exports: [UserService],
})
export class UserModule {}
