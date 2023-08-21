import { TABLES } from 'src/common/constants';
import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm';

export class UpdateUserVenueFieldMigration1692260542541 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      TABLES.user,
      new TableColumn({
        name: 'venue_id',
        type: 'int',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      TABLES.user,
      new TableForeignKey({
        columnNames: ['venue_id'],
        referencedColumnNames: ['_id'],
        referencedTableName: TABLES.venue,
      }),
    );

    await queryRunner.addColumn(
      TABLES.venue,
      new TableColumn({
        name: 'user_id',
        type: 'int',
      }),
    );

    await queryRunner.createForeignKey(
      TABLES.venue,
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['_id'],
        referencedTableName: TABLES.user,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tableUser = await queryRunner.getTable(TABLES.user);
    const userForeignKey = tableUser.foreignKeys.find((fk) => fk.columnNames.indexOf('venue_id') !== -1);

    const tableVenue = await queryRunner.getTable(TABLES.venue);
    const venueForeignKey = tableVenue.foreignKeys.find((fk) => fk.columnNames.indexOf('user_id') !== -1);

    queryRunner.dropForeignKey(TABLES.user, userForeignKey);
    queryRunner.dropForeignKey(TABLES.rating, venueForeignKey);
  }
}
