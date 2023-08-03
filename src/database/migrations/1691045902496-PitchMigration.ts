import { TABLE } from 'src/common/enums/table.enum';
import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';

export class PitchMigration1691045902496 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: TABLE.Pitch,
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
            default: 'now()',
          },
        ],
      }),
      true,
    );

    await queryRunner.addColumn(
      TABLE.Pitch,
      new TableColumn({
        name: 'venue_id',
        type: 'int',
      }),
    );

    await queryRunner.createForeignKey(
      TABLE.Pitch,
      new TableForeignKey({
        columnNames: ['venue_id'],
        referencedColumnNames: ['_id'],
        referencedTableName: TABLE.Venue,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(TABLE.Pitch);
    const venueForeignKey = table.foreignKeys.find((fk) => fk.columnNames.indexOf('venue_id') !== -1);
    const pitchCategoryForeignKey = table.foreignKeys.find((fk) => fk.columnNames.indexOf('pitchCategory_id') !== -1);
    const bookingForeignKey = table.foreignKeys.find((fk) => fk.columnNames.indexOf('booking_id') !== -1);

    await queryRunner.dropForeignKeys(TABLE.Pitch, [venueForeignKey, pitchCategoryForeignKey, bookingForeignKey]);
    await queryRunner.dropTable(TABLE.Pitch);
  }
}
