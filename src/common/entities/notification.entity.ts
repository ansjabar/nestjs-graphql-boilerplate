import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CommonModuleTables, NotificationsColumns } from '../@types';

@ObjectType()
@Entity({ name: CommonModuleTables.NOTIFICATIONS })
export class NotificationEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  [NotificationsColumns.ID]: string;

  @Column()
  [NotificationsColumns.USER_ID]: number;

  @Field()
  @Column()
  [NotificationsColumns.TITLE]: string;

  @Field()
  @Column()
  [NotificationsColumns.CONTENT]: string;

  @Field()
  @CreateDateColumn()
  [NotificationsColumns.CREATED_AT]: Date;

  @Field({ nullable: true })
  @Column()
  [NotificationsColumns.READ_AT]?: Date;

  @Field({ nullable: true })
  @Column()
  [NotificationsColumns.ENTITY]?: string;

  @Field({ nullable: true })
  @Column()
  [NotificationsColumns.ENTITY_ID]?: number;

  @Field({ nullable: true })
  @Column()
  [NotificationsColumns.EXTERNAL_LINK]?: string;
}
