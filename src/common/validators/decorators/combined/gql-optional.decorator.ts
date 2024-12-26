import { applyDecorators } from '@nestjs/common';
import { Field } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

export function GqlOptional(type?: any) {
  return applyDecorators(
    Field(type || undefined, { nullable: true }),
    IsOptional(),
  );
}
