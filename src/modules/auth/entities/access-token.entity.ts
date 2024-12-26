import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { AccessTokensColumns, AuthModuleTables } from '../@types/tables.type';

@ObjectType()
@Entity({ name: AuthModuleTables.ACCESS_TOKENS })
export class AccessTokenEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  [AccessTokensColumns.ID]: string;

  @Column()
  [AccessTokensColumns.USER_ID]: number;

  @Column()
  [AccessTokensColumns.TOKEN]: string;

  @Column()
  [AccessTokensColumns.EXPIRES_AT]: number;

  @CreateDateColumn()
  [AccessTokensColumns.CREATED_AT]: Date;

  // Relations
  @OneToOne(() => UserEntity, { eager: true })
  @JoinColumn()
  user: UserEntity;
}
