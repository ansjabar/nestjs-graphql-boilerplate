import { ObjectType, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { LocaleEntity } from '../../../common/entities/locale.entity';
import { PublicResolver } from '../../auth/decorators';
import { SystemService } from '../services/system.service';

@ObjectType()
class SystemQuery {}

@Resolver(() => SystemQuery)
@PublicResolver(['locales'])
export class SystemQueryResolver {
  constructor(private systemService: SystemService) {}

  @Query(() => SystemQuery)
  system() {
    return {};
  }

  @ResolveField(() => [LocaleEntity])
  async locales(): Promise<LocaleEntity[]> {
    return await this.systemService.locales();
  }
}
