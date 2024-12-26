import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import {
  integerPrimary,
  integerUnsigned,
  integerUnsignedNullable,
  varchar,
  varcharNullable,
  createdAt,
  deletedAt,
  updatedAt,
} from '../columns';
import { FileModuleTables, FilesColumns } from '../../modules/file';
import { UserModuleTables, UsersColumns } from '../../modules/user/@types';

export class CreateFilesTable1704898728049 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: FileModuleTables.FILES,
        columns: [
          integerPrimary(),
          varcharNullable(FilesColumns.ENTITY),
          integerUnsignedNullable(FilesColumns.ENTITY_ID),
          varcharNullable(FilesColumns.FILE_TYPE),
          varchar(FilesColumns.FILE),
          varchar(FilesColumns.NAME),
          varchar(FilesColumns.MIME),
          varchar(FilesColumns.SIZE),
          varcharNullable(FilesColumns.METADATA),
          varchar(FilesColumns.DISK),
          integerUnsigned(FilesColumns.USER_ID),
          createdAt(),
          updatedAt(),
          deletedAt(),
        ],
        foreignKeys: [
          {
            columnNames: [FilesColumns.USER_ID],
            referencedColumnNames: [UsersColumns.ID],
            referencedTableName: UserModuleTables.USERS,
            onDelete: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(FileModuleTables.FILES);
  }
}
