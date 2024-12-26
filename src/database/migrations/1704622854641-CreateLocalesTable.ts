import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { LocalesColumns, CommonModuleTables } from '../../common/@types';
import { integerPrimary, varcharUnique, booleanFalse } from '../columns';

export class CreateLocalesTable1704622854641 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: CommonModuleTables.LOCALES,
        columns: [
          integerPrimary(),
          varcharUnique(LocalesColumns.NAME),
          varcharUnique(LocalesColumns.TITLE),
          booleanFalse(LocalesColumns.ACTIVE),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(CommonModuleTables.LOCALES);
  }
}
