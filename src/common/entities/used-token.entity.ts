import { ObjectType } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { CommonModuleTables, TokenTypes, UsedTokensColumns } from '../@types';

@ObjectType()
@Entity({ name: CommonModuleTables.USED_TOKENS })
export class UsedTokenEntity {
  @PrimaryGeneratedColumn('uuid')
  [UsedTokensColumns.ID]: string;

  @Column()
  [UsedTokensColumns.TOKEN]: string;

  @Column()
  [UsedTokensColumns.TYPE]: TokenTypes;

  @Column()
  [UsedTokensColumns.EXPIRES_ON]: number;

  @CreateDateColumn()
  [UsedTokensColumns.CREATED_AT]: Date;
}
