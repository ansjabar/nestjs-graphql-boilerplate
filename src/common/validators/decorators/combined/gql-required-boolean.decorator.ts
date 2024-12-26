import { applyDecorators } from '@nestjs/common';
import { Field } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty } from '..';

export function GqlRequiredBoolean() {
  return applyDecorators(Field(), IsNotEmpty(), IsBoolean());
}
