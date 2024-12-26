import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CommonModuleTables, LocalesColumns } from '../@types';

@ObjectType()
@Entity({ name: CommonModuleTables.LOCALES })
export class LocaleEntity {
  @PrimaryGeneratedColumn()
  [LocalesColumns.ID]: number;

  @Field()
  @Column()
  [LocalesColumns.NAME]: string;

  @Field()
  @Column()
  [LocalesColumns.TITLE]: string;

  @Column({ default: false })
  [LocalesColumns.ACTIVE]: boolean;
}
