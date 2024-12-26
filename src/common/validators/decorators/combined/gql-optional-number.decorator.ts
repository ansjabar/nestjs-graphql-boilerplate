import { applyDecorators } from '@nestjs/common';
import { Field } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { IsNumber } from '..';

export function GqlOptionalNumber() {
  return applyDecorators(Field({ nullable: true }), IsOptional(), IsNumber());
}
