import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { CommonModuleTables, LocalesColumns } from '../../common/@types';
import { UserModuleTables, UsersColumns } from '../../modules/user/@types';
import {
  createdAt,
  deletedAt,
  integerPrimary,
  timestampNullable,
  updatedAt,
  varchar,
  varcharNullable,
  varcharUnique,
} from '../columns';

export class CreateUsersTable1704622854642 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: UserModuleTables.USERS,
        columns: [
          integerPrimary(),
          varcharUnique(UsersColumns.EMAIL),
          varchar(UsersColumns.NAME),
          varcharNullable(UsersColumns.PASSWORD),
          timestampNullable(UsersColumns.EMAIL_VERIFIED_AT),
          varcharNullable(UsersColumns.LOCALE),
          varcharNullable(UsersColumns.SOCIAL_LOGIN_PROVIDER),
          createdAt(),
          updatedAt(),
          deletedAt(),
        ],
        foreignKeys: [
          {
            columnNames: [UsersColumns.LOCALE],
            referencedColumnNames: [LocalesColumns.NAME],
            referencedTableName: CommonModuleTables.LOCALES,
            onDelete: 'RESTRICT',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(UserModuleTables.USERS);
  }
}
