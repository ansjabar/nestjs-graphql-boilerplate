import { applyDecorators } from '@nestjs/common';
import { Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from '..';

export function GqlRequiredEmail() {
  return applyDecorators(Field(), IsNotEmpty(), IsEmail());
}
