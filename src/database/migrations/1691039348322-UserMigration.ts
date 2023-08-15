import { BASE_COLUMNS, TABLES } from 'src/common/constants';
import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class UserMigration1691039348322 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: TABLES.user,
        columns: [
          {
            name: 'username',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'firstName',
            type: 'varchar',
          },
          {
            name: 'lastName',
            type: 'varchar',
          },
          {
            name: 'phone',
            type: 'varchar',
          },
          {
            name: 'password',
            type: 'varchar',
          },
          {
            name: 'role',
            type: 'varchar',
          },
          ...BASE_COLUMNS,
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      TABLES.user,
      new TableIndex({
        name: 'username-idx',
        columnNames: ['username'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(TABLES.user, 'username-idx');
    await queryRunner.dropTable(TABLES.user);
  }
}
