import { BASE_COLUMNS, TABLES } from 'src/common/constants';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class TeamMigrations1693205012686 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: TABLES.team,
        columns: [
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'contact',
            type: 'varchar',
          },
          ...BASE_COLUMNS,
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropTable(TABLES.team);
  }
}
