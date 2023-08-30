import { BASE_COLUMNS, TABLES } from 'src/common/constants';
import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';

export class RatingMigration1691046028952 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: TABLES.rating,
        columns: [
          {
            name: 'content',
            type: 'varchar',
          },
          {
            name: 'rate',
            type: 'float',
          },
          ...BASE_COLUMNS,
        ],
      }),
      true,
    );

    await queryRunner.addColumn(
      TABLES.rating,
      new TableColumn({
        name: 'bookingId',
        type: 'int',
      }),
    );
    await queryRunner.createForeignKey(
      TABLES.rating,
      new TableForeignKey({
        columnNames: ['bookingId'],
        referencedColumnNames: ['id'],
        referencedTableName: TABLES.booking,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(TABLES.rating);
    const bookingForeignKey = table.foreignKeys.find((fk) => fk.columnNames.indexOf('bookingId') !== -1);

    await queryRunner.dropForeignKey(TABLES.rating, bookingForeignKey);
  }
}
