import { applyDecorators } from '@nestjs/common';
import { Field } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { IsEmail } from '..';

export function GqlOptionalEmail() {
  return applyDecorators(Field({ nullable: true }), IsOptional(), IsEmail());
}
