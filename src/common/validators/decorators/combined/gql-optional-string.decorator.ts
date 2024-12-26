import { applyDecorators } from '@nestjs/common';
import { Field } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { IsString } from '..';

export function GqlOptionalString() {
  return applyDecorators(Field({ nullable: true }), IsOptional(), IsString());
}
