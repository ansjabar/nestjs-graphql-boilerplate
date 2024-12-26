import { NotImplementedException } from '@nestjs/common';
import { EntityTarget, ObjectLiteral } from 'typeorm';
import { UserEntity } from '../../modules/user/entities/user.entity';
import { EntityNamesType } from '../@types/entity.type';
import { PaginationDto } from '../dtos';

export const paginate = (
  pagination?: PaginationDto,
): { take?: number; skip?: number } => {
  if (!pagination?.page) return {};

  const take = pagination.perPage
    ? pagination.perPage > 100
      ? 100
      : pagination.perPage
    : 20;
  const skip = take * (pagination.page - 1);
  return { take, skip };
};

export const getEntityClass = (entityName: EntityNamesType) => {
  const entities: Record<EntityNamesType, EntityTarget<ObjectLiteral>> = {
    userEntity: UserEntity,
  };

  if (!entities[entityName])
    throw new NotImplementedException(
      `Entity ${entityName} is not configured for validation`,
    );
  return entities[entityName];
};
