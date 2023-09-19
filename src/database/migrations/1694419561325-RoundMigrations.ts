import { BASE_COLUMNS, TABLES } from 'src/common/constants';
import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';

export class RoundMigrations1694419561325 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: TABLES.round,
        columns: [
          {
            name: 'no',
            type: 'int',
          },
          ...BASE_COLUMNS,
        ],
      }),
    );

    await queryRunner.addColumn(TABLES.round, new TableColumn({ name: 'tournamentId', type: 'int' }));

    await queryRunner.createForeignKey(
      TABLES.round,
      new TableForeignKey({
        columnNames: ['tournamentId'],
        referencedColumnNames: ['id'],
        referencedTableName: TABLES.tournament,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const roundTable = await queryRunner.getTable(TABLES.round);

    const tournamentFk = roundTable.foreignKeys.find((fk) => fk.columnNames.indexOf('tournamentId') !== -1);

    await queryRunner.dropForeignKeys(roundTable, [tournamentFk]);

    await queryRunner.dropTable(roundTable);
  }
}
