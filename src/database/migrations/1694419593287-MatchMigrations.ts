import { BASE_COLUMNS, TABLES } from 'src/common/constants';
import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';

export class MatchMigrations1694419593287 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: TABLES.match,
        columns: [
          {
            name: 'time',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'hostGoals',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'guestGoals',
            type: 'int',
            isNullable: true,
          },
          ...BASE_COLUMNS,
        ],
      }),
      true,
    );

    await queryRunner.addColumn(
      TABLES.match,
      new TableColumn({
        name: 'hostId',
        type: 'int',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      TABLES.match,
      new TableColumn({
        name: 'guestId',
        type: 'int',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(TABLES.match, new TableColumn({ name: 'roundId', type: 'int' }));

    await queryRunner.createForeignKey(
      TABLES.match,
      new TableForeignKey({
        columnNames: ['hostId'],
        referencedColumnNames: ['id'],
        referencedTableName: TABLES.team,
      }),
    );

    await queryRunner.createForeignKey(
      TABLES.match,
      new TableForeignKey({
        columnNames: ['guestId'],
        referencedColumnNames: ['id'],
        referencedTableName: TABLES.team,
      }),
    );

    await queryRunner.createForeignKey(
      TABLES.match,
      new TableForeignKey({
        columnNames: ['roundId'],
        referencedColumnNames: ['id'],
        referencedTableName: TABLES.round,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const matchTable = await queryRunner.getTable(TABLES.match);

    const hostIdFk = matchTable.foreignKeys.find((fk) => fk.columnNames.indexOf('hostId') !== -1);
    const guestIdFk = matchTable.foreignKeys.find((fk) => fk.columnNames.indexOf('guestId') !== -1);
    const tournamentFk = matchTable.foreignKeys.find((fk) => fk.columnNames.indexOf('roundId') !== -1);

    await queryRunner.dropForeignKeys(matchTable, [hostIdFk, guestIdFk, tournamentFk]);

    await queryRunner.dropTable(matchTable);
  }
}
