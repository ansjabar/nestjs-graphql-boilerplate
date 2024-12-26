import {
  Args,
  ObjectType,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { EmailDto } from '../../../common/dtos';
import { InTransaction } from '../../../utils';
import { PublicResolver } from '../decorators/public-resolver.decorator';
import { AuthService } from '../services/auth.service';

@ObjectType()
class AuthQuery {}

@Resolver(() => AuthQuery)
@PublicResolver(['isRegistered', 'refreshAccessToken'])
export class AuthQueryResolver {
  constructor(private authService: AuthService) {}

  @Query(() => AuthQuery)
  @InTransaction()
  auth() {
    return {};
  }

  @ResolveField(() => Boolean)
  async isRegistered(@Args('filters') dto: EmailDto): Promise<boolean> {
    return await this.authService.isRegistered(dto);
  }
}
