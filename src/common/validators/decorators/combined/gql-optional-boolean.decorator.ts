import { applyDecorators } from '@nestjs/common';
import { Field } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { IsBoolean } from '..';

export function GqlOptionalBoolean() {
  return applyDecorators(Field({ nullable: true }), IsOptional(), IsBoolean());
}
