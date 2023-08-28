import { BASE_COLUMNS, TABLES } from 'src/common/constants';
import { ModeEnum } from 'src/common/enums/mode.enum';
import { TournamentTypeEnum } from 'src/common/enums/tournament.enum';
import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';

export class TournamentMigrations1693206120012 implements MigrationInterface {
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
            name: 'total_teams',
            type: 'int',
          },
          {
            name: 'teams',
            type: 'json',
            isNullable: true,
          },
          {
            name: 'matches',
            type: 'json',
            isNullable: true,
          },
          ...BASE_COLUMNS,
        ],
      }),
      true,
    );

    await queryRunner.addColumn(TABLES.tournament, new TableColumn({ name: 'venue_id', type: 'int' }));

    await queryRunner.createForeignKey(
      TABLES.tournament,
      new TableForeignKey({
        columnNames: ['venue_id'],
        referencedColumnNames: ['_id'],
        referencedTableName: TABLES.venue,
      }),
    );

    await queryRunner.addColumn(TABLES.tournament, new TableColumn({ name: 'user_id', type: 'int' }));

    await queryRunner.createForeignKey(
      TABLES.tournament,
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['_id'],
        referencedTableName: TABLES.user,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(TABLES.tournament);

    const tournamentVenue = table.foreignKeys.find((fk) => fk.columnNames.indexOf('venue_id') !== -1);
    const tournamentUser = table.foreignKeys.find((fk) => fk.columnNames.indexOf('user_id') !== -1);

    await queryRunner.dropForeignKeys(TABLES.tournament, [tournamentVenue, tournamentUser]);

    await queryRunner.dropTable(TABLES.tournament);
  }
}
