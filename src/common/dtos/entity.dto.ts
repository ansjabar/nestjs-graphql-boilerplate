import { InputType } from '@nestjs/graphql';
import { GqlOptionalNumber } from '../validators/decorators';

@InputType()
export class PaginationDto {
  @GqlOptionalNumber()
  perPage?: number;

  @GqlOptionalNumber()
  page: number;
}
