import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import {
  AccessTokensColumns,
  AccessTokensTypes,
  AuthModuleTables,
} from '../../modules/auth/@types/tables.type';
import { UserModuleTables, UsersColumns } from '../../modules/user/@types';
import { createdAt, integerUnsigned, uuidPrimary, varchar } from '../columns';
export class CreateAccessTokensTable1733818355555
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: AuthModuleTables.ACCESS_TOKENS,
        columns: [
          uuidPrimary(),
          integerUnsigned(AccessTokensColumns.USER_ID),
          varchar(AccessTokensColumns.TOKEN, { isUnique: true }),
          varchar(AccessTokensColumns.TOKEN_TYPE, {
            default: `'${AccessTokensTypes.ACCESS}'`,
          }),
          integerUnsigned(AccessTokensColumns.EXPIRES_AT),
          createdAt(),
        ],
        foreignKeys: [
          {
            columnNames: [AccessTokensColumns.USER_ID],
            referencedColumnNames: [UsersColumns.ID],
            referencedTableName: UserModuleTables.USERS,
            onDelete: 'CASCADE',
          },
        ],
      }),
    );
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(AuthModuleTables.ACCESS_TOKENS);
  }
}
