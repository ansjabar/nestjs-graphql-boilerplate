import { applyDecorators } from '@nestjs/common';
import { Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from '..';

export function GqlRequiredString() {
  return applyDecorators(Field(), IsNotEmpty(), IsString());
}
