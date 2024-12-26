import { Field, ObjectType } from '@nestjs/graphql';
import {
  AfterLoad,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FileTypes } from '../@types/file.type';
import { DriverType } from '@codebrew/nestjs-storage';
import GraphQLJSON from 'graphql-type-json';
import { FileModuleTables, FilesColumns } from '../@types';

@ObjectType()
@Entity({ name: FileModuleTables.FILES })
export class FileEntity {
  @Field()
  @PrimaryGeneratedColumn()
  [FilesColumns.ID]: number;

  @Column({ nullable: true })
  [FilesColumns.ENTITY]: string;

  @Column({ nullable: true })
  [FilesColumns.ENTITY_ID]: number;

  @Column({ nullable: true })
  [FilesColumns.FILE_TYPE]: FileTypes;

  @Field()
  @Column()
  [FilesColumns.FILE]: string;

  @Field()
  @Column()
  [FilesColumns.NAME]: string;

  @Column()
  [FilesColumns.MIME]: string;

  @Field(() => GraphQLJSON, { nullable: true })
  @Column({ nullable: true })
  [FilesColumns.METADATA]?: string;

  @Field()
  @Column()
  [FilesColumns.SIZE]: number;

  @Column({ nullable: false })
  [FilesColumns.DISK]: DriverType;

  @Column()
  [FilesColumns.USER_ID]: number;

  @Field()
  @CreateDateColumn()
  [FilesColumns.CREATED_AT]: Date;

  @UpdateDateColumn()
  [FilesColumns.UPDATED_AT]: Date;

  @DeleteDateColumn({ nullable: true })
  [FilesColumns.DELETED_AT]: Date;

  @Field(() => [FileEntity], { nullable: true })
  children: FileEntity[];

  // Hooks
  @AfterLoad()
  parseMetadata() {
    this.metadata = JSON.parse(this.metadata);
  }
}
