import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import {
  createdAt,
  integerUnsigned,
  integerUnsignedNullable,
  timestampNullable,
  uuidPrimary,
  varchar,
  varcharNullable,
} from '../columns';
import { NotificationsColumns, CommonModuleTables } from '../../common/@types';
import { UserModuleTables, UsersColumns } from '../../modules/user/@types';

export class CreateNotificationsTable1726240674303
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: CommonModuleTables.NOTIFICATIONS,
        columns: [
          uuidPrimary(),
          integerUnsigned(NotificationsColumns.USER_ID),
          varchar(NotificationsColumns.TITLE),
          varchar(NotificationsColumns.CONTENT),
          varcharNullable(NotificationsColumns.ENTITY),
          integerUnsignedNullable(NotificationsColumns.ENTITY_ID),
          varcharNullable(NotificationsColumns.EXTERNAL_LINK),
          timestampNullable(NotificationsColumns.READ_AT),
          createdAt(),
        ],
        foreignKeys: [
          {
            columnNames: [NotificationsColumns.USER_ID],
            referencedColumnNames: [UsersColumns.ID],
            referencedTableName: UserModuleTables.USERS,
            onDelete: 'RESTRICT',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(CommonModuleTables.NOTIFICATIONS);
  }
}
