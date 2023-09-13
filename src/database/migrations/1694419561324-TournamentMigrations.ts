import { BASE_COLUMNS, TABLES } from 'src/common/constants';
import { ModeEnum, TournamentTypeEnum } from 'src/tournament/enums/tournament.enum';
import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';

export class TournamentMigrations1694419561324 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: TABLES.tournament,
        columns: [
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'cover',
            type: 'varchar',
          },
          {
            name: 'mode',
            type: 'enum',
            enum: Object.values(ModeEnum),
          },
          {
            name: 'type',
            type: 'enum',
            enum: Object.values(TournamentTypeEnum),
          },
          {
            name: 'totalTeam',
            type: 'int',
          },
          ...BASE_COLUMNS,
        ],
      }),
      true,
    );

    await queryRunner.addColumn(TABLES.tournament, new TableColumn({ name: 'venueId', type: 'int' }));

    await queryRunner.createForeignKey(
      TABLES.tournament,
      new TableForeignKey({
        columnNames: ['venueId'],
        referencedColumnNames: ['id'],
        referencedTableName: TABLES.venue,
      }),
    );

    await queryRunner.addColumn(TABLES.tournament, new TableColumn({ name: 'userId', type: 'int' }));

    await queryRunner.createForeignKey(
      TABLES.tournament,
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: TABLES.user,
      }),
    );

    await queryRunner.addColumn(TABLES.tournament, new TableColumn({ name: 'pitchCategoryId', type: 'int' }));

    await queryRunner.createForeignKey(
      TABLES.tournament,
      new TableForeignKey({
        columnNames: ['pitchCategoryId'],
        referencedColumnNames: ['id'],
        referencedTableName: TABLES.user,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(TABLES.tournament);

    const venueFk = table.foreignKeys.find((fk) => fk.columnNames.indexOf('venueId') !== -1);
    const userFk = table.foreignKeys.find((fk) => fk.columnNames.indexOf('userId') !== -1);
    const pitchCategoryFk = table.foreignKeys.find((fk) => fk.columnNames.indexOf('pitchCategoryId') !== -1);

    await queryRunner.dropForeignKeys(TABLES.tournament, [pitchCategoryFk, venueFk, userFk]);

    await queryRunner.dropTable(TABLES.tournament);
  }
}
