import { BASE_COLUMNS, TABLES } from 'src/common/constants';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class MatchMigrations1693205324421 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: TABLES.match,
        columns: [
          {
            name: 'host',
            type: 'json',
          },
          {
            name: 'guest',
            type: 'json',
          },
          {
            name: 'time',
            type: 'timestamp',
          },
          {
            name: 'hostGoals',
            type: 'int',
          },
          {
            name: 'guestGoals',
            type: 'int',
          },
          ...BASE_COLUMNS,
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(TABLES.match);
  }
}
