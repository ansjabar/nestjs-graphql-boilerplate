import {
  DeepPartial,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from 'typeorm';
import { BaseRepositoryInterface } from '../interfaces';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

interface HasId {
  id: number | string;
}

export abstract class BaseRepository<T extends HasId>
  implements BaseRepositoryInterface<T>
{
  private entity: Repository<T>;
  protected constructor(entity: Repository<T>) {
    this.entity = entity;
  }

  public create(data: DeepPartial<T>): T {
    return this.entity.create(data);
  }

  public createMany(data: DeepPartial<T>[]): T[] {
    return this.entity.create(data);
  }

  public async save(data: DeepPartial<T>): Promise<T> {
    return await this.entity.save(data);
  }

  public async saveMany(data: DeepPartial<T>[]): Promise<T[]> {
    return this.entity.save(data);
  }

  public async createAndSave(data: DeepPartial<T>): Promise<T> {
    return this.save(this.create(data));
  }

  public async createAndSaveMany(data: DeepPartial<T>[]): Promise<T[]> {
    return this.saveMany(this.createMany(data));
  }

  public async update(
    where: FindOptionsWhere<T>,
    partialEntity: QueryDeepPartialEntity<T>,
  ): Promise<UpdateResult> {
    return await this.entity.update(where, partialEntity);
  }

  public async findOneById(id: any): Promise<T> {
    const options: FindOptionsWhere<T> = {
      id: id,
    };
    return await this.entity.findOneBy(options);
  }

  public async findOneBy(where: FindOptionsWhere<T>): Promise<T> {
    return await this.entity.findOneBy(where);
  }

  public async findOne(options: FindOneOptions<T>): Promise<T> {
    return await this.entity.findOne(options);
  }

  public async findOneWithRelations(
    relations: FindOptionsRelations<T>,
  ): Promise<T> {
    return await this.entity.findOne({ relations });
  }

  public async findManyBy(where: FindOptionsWhere<T>): Promise<T[]> {
    return await this.entity.findBy(where);
  }

  public async findMany(options: FindManyOptions<T>): Promise<T[]> {
    return await this.entity.find(options);
  }

  public async findManyWithRelations(
    relations: FindOptionsRelations<T>,
  ): Promise<T[]> {
    return await this.entity.find({ relations });
  }

  public async remove(entity: T): Promise<T> {
    return await this.entity.remove(entity);
  }

  public async removeMany(entities: T[]): Promise<T[]> {
    return await this.entity.remove(entities);
  }

  public async delete(
    criteria: number | number[] | FindOptionsWhere<T>,
  ): Promise<DeleteResult> {
    return await this.entity.delete(criteria);
  }

  public async preload(entityLike: DeepPartial<T>): Promise<T> {
    return await this.entity.preload(entityLike);
  }
}
