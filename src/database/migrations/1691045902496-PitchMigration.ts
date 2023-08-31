import { BASE_COLUMNS, TABLES } from 'src/common/constants';
import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';

export class PitchMigration1691045902496 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: TABLES.pitch,
        columns: [
          {
            name: 'no',
            type: 'int',
          },
          {
            name: 'price',
            type: 'int',
          },
          ...BASE_COLUMNS,
        ],
      }),
      true,
    );

    await queryRunner.addColumn(
      TABLES.pitch,
      new TableColumn({
        name: 'venueId',
        type: 'int',
      }),
    );

    await queryRunner.createForeignKey(
      TABLES.pitch,
      new TableForeignKey({
        columnNames: ['venueId'],
        referencedColumnNames: ['id'],
        referencedTableName: TABLES.venue,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(TABLES.pitch);
    const venueForeignKey = table.foreignKeys.find((fk) => fk.columnNames.indexOf('venueId') !== -1);

    await queryRunner.dropForeignKeys(TABLES.pitch, [venueForeignKey]);
    await queryRunner.dropTable(TABLES.pitch);
  }
}
