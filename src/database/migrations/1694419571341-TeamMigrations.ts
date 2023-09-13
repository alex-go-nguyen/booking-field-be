import { BASE_COLUMNS, TABLES } from 'src/common/constants';
import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';

export class TeamMigrations1694419571341 implements MigrationInterface {
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
            name: 'avatar',
            type: 'varchar',
          },
          {
            name: 'contact',
            type: 'varchar',
            isNullable: true,
          },
          ...BASE_COLUMNS,
        ],
      }),
      true,
    );

    await queryRunner.addColumn(TABLES.team, new TableColumn({ name: 'tournamentId', type: 'int' }));

    await queryRunner.createForeignKey(
      TABLES.team,
      new TableForeignKey({
        columnNames: ['tournamentId'],
        referencedColumnNames: ['id'],
        referencedTableName: TABLES.tournament,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(TABLES.team);

    const fk = table.foreignKeys.find((fk) => fk.columnNames.indexOf('tournamentId') !== -1);

    await queryRunner.dropForeignKey(TABLES.team, fk);

    await queryRunner.dropTable(TABLES.team);
  }
}
