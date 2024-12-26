import { applyDecorators } from '@nestjs/common';
import { Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from '..';
import { ValidateIf } from 'class-validator';

type ValidateIfCallback = (o: any) => boolean;

export function GqlRequiredStringIf(condition: ValidateIfCallback) {
  return applyDecorators(
    ValidateIf(condition),
    Field({ nullable: true }),
    IsNotEmpty(),
    IsString(),
  );
}
