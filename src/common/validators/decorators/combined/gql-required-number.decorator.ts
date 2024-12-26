import { applyDecorators } from '@nestjs/common';
import { Field } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber } from '..';

export function GqlRequiredNumber() {
  return applyDecorators(Field(), IsNotEmpty(), IsNumber());
}
