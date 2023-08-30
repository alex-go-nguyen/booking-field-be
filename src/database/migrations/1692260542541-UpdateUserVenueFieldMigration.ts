import { TABLES } from 'src/common/constants';
import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm';

export class UpdateUserVenueFieldMigration1692260542541 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      TABLES.user,
      new TableColumn({
        name: 'venueId',
        type: 'int',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      TABLES.user,
      new TableForeignKey({
        columnNames: ['venueId'],
        referencedColumnNames: ['id'],
        referencedTableName: TABLES.venue,
      }),
    );

    await queryRunner.addColumn(
      TABLES.venue,
      new TableColumn({
        name: 'userId',
        type: 'int',
      }),
    );

    await queryRunner.createForeignKey(
      TABLES.venue,
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: TABLES.user,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tableUser = await queryRunner.getTable(TABLES.user);
    const userForeignKey = tableUser.foreignKeys.find((fk) => fk.columnNames.indexOf('venueId') !== -1);

    const tableVenue = await queryRunner.getTable(TABLES.venue);
    const venueForeignKey = tableVenue.foreignKeys.find((fk) => fk.columnNames.indexOf('userId') !== -1);

    await queryRunner.dropForeignKey(TABLES.user, userForeignKey);
    await queryRunner.dropForeignKey(TABLES.venue, venueForeignKey);
  }
}
