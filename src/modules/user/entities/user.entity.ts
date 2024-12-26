import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { firstWord } from '../../../common/helpers';
import { FileEntity } from '../../file/entities/file.entity';
import { UserModuleTables, UsersColumns } from '../@types';
import { SocialLoginProviders } from '../@types/social.type';

@ObjectType()
@Entity({ name: UserModuleTables.USERS })
export class UserEntity {
  @Field()
  @PrimaryGeneratedColumn()
  [UsersColumns.ID]: number;

  @Field()
  @Column()
  [UsersColumns.EMAIL]: string;

  @Field()
  @Column()
  [UsersColumns.NAME]: string;

  @Column()
  [UsersColumns.PASSWORD]: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  [UsersColumns.EMAIL_VERIFIED_AT]: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  [UsersColumns.LOCALE]: string;

  @Column()
  [UsersColumns.SOCIAL_LOGIN_PROVIDER]: SocialLoginProviders;

  @CreateDateColumn()
  [UsersColumns.CREATED_AT]: Date;

  @UpdateDateColumn()
  [UsersColumns.UPDATED_AT]: Date;

  @Field(() => FileEntity, { nullable: true })
  avatar: FileEntity;

  get firstName(): string {
    return firstWord(this.name);
  }
}
