import {
  DeepPartial,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  FindOptionsRelations,
  FindOptionsWhere,
  UpdateResult,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export interface BaseRepositoryInterface<T> {
  create(entity: DeepPartial<T>): T;
  createMany(data: DeepPartial<T>[]): T[];
  save(entity: DeepPartial<T>): Promise<T>;
  saveMany(data: DeepPartial<T>[]): Promise<T[]>;
  createAndSave(entity: DeepPartial<T>): Promise<T>;
  createAndSaveMany(data: DeepPartial<T>[]): Promise<T[]>;
  update(
    where: FindOptionsWhere<T>,
    partialEntity: QueryDeepPartialEntity<T>,
  ): Promise<UpdateResult>;
  findOneById(id: number): Promise<T>;
  findOneBy(where: FindOptionsWhere<T>): Promise<T>;
  findOne(options: FindOneOptions<T>): Promise<T>;
  findOneWithRelations(relations: FindOptionsRelations<T>): Promise<T>;
  findManyBy(where: FindOptionsWhere<T>): Promise<T[]>;
  findMany(options?: FindManyOptions<T>): Promise<T[]>;
  findManyWithRelations(relations: FindOptionsRelations<T>): Promise<T[]>;
  remove(entity: T): Promise<T>;
  removeMany(entities: T[]): Promise<T[]>;
  delete(
    criteria: number | number[] | FindOptionsWhere<T>,
  ): Promise<DeleteResult>;
  preload(entityLike: DeepPartial<T>): Promise<T>;
}
