import { TABLES } from 'src/common/constants';
import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';

export class PitchMigration1691045902496 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: TABLES.pitch,
        columns: [
          {
            name: '_id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'no',
            type: 'int',
          },
          {
            name: 'price',
            type: 'int',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'deletedAt',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.addColumn(
      TABLES.pitch,
      new TableColumn({
        name: 'venue_id',
        type: 'int',
      }),
    );

    await queryRunner.createForeignKey(
      TABLES.pitch,
      new TableForeignKey({
        columnNames: ['venue_id'],
        referencedColumnNames: ['_id'],
        referencedTableName: TABLES.venue,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(TABLES.pitch);
    const venueForeignKey = table.foreignKeys.find((fk) => fk.columnNames.indexOf('venue_id') !== -1);
    const pitchCategoryForeignKey = table.foreignKeys.find((fk) => fk.columnNames.indexOf('pitchCategory_id') !== -1);
    const bookingForeignKey = table.foreignKeys.find((fk) => fk.columnNames.indexOf('booking_id') !== -1);

    await queryRunner.dropForeignKeys(TABLES.pitch, [venueForeignKey, pitchCategoryForeignKey, bookingForeignKey]);
    await queryRunner.dropTable(TABLES.pitch);
  }
}
