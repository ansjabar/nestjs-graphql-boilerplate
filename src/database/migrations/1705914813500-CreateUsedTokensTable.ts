import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { CommonModuleTables, UsedTokensColumns } from '../../common/@types';
import {
  createdAt,
  integerUnsigned,
  uuidPrimary,
  varchar,
  varcharUnique,
} from '../columns';

export class CreateUsedTokensTable1705914813500 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: CommonModuleTables.USED_TOKENS,
        columns: [
          uuidPrimary(),
          varcharUnique(UsedTokensColumns.TOKEN),
          varchar(UsedTokensColumns.TYPE),
          integerUnsigned(UsedTokensColumns.EXPIRES_ON),
          createdAt(),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(CommonModuleTables.USED_TOKENS);
  }
}
