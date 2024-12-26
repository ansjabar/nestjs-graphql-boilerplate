import { InputType } from '@nestjs/graphql';
import {
  IsUUID,
  GqlOptionalNumber,
  GqlOptionalString,
  GqlRequiredNumber,
  GqlRequiredString,
} from '../validators/decorators';

@InputType()
export class RequiredIdDto {
  @GqlRequiredNumber()
  id: number;
}

@InputType()
export class OptionalIdDto {
  @GqlOptionalNumber()
  id?: number;
}

@InputType()
export class RequiredUUIDDto {
  @GqlRequiredString()
  @IsUUID()
  id: string;
}

@InputType()
export class OptionalUUIDDto {
  @GqlOptionalString()
  @IsUUID()
  id?: string;
}
