import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserEntity } from '../../user/entities/user.entity';

/**
 * Decorator to get user from the request
 */
export const User = createParamDecorator(
  async (data: unknown, context: ExecutionContext): Promise<UserEntity> => {
    const ctx = GqlExecutionContext.create(context);

    const req = ctx.getContext().req;

    const user = await req.user;

    if (user && user.id) return user;
  },
);
