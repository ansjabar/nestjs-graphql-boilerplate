import { applyDecorators } from '@nestjs/common';
import { Field } from '@nestjs/graphql';
import { IsNotEmpty } from '..';

export function GqlRequired(type?: any) {
  return applyDecorators(Field(type || undefined), IsNotEmpty());
}
