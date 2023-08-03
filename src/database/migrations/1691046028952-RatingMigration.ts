import { TABLE } from 'src/common/enums/table.enum';
import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';

export class RatingMigration1691046028952 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: TABLE.Rating,
        columns: [
          {
            name: '_id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'content',
            type: 'varchar',
          },
          {
            name: 'rate',
            type: 'boolean',
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
      TABLE.Rating,
      new TableColumn({
        name: 'booking_id',
        type: 'int',
      }),
    );
    await queryRunner.createForeignKey(
      TABLE.Rating,
      new TableForeignKey({
        columnNames: ['booking_id'],
        referencedColumnNames: ['_id'],
        referencedTableName: TABLE.Booking,
      }),
    );

    await queryRunner.addColumn(
      TABLE.Booking,
      new TableColumn({
        name: 'rating_id',
        type: 'int',
      }),
    );
    await queryRunner.createForeignKey(
      TABLE.Booking,
      new TableForeignKey({
        columnNames: ['rating_id'],
        referencedColumnNames: ['_id'],
        referencedTableName: TABLE.Rating,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(TABLE.Rating);
    const bookingForeignKey = table.foreignKeys.find((fk) => fk.columnNames.indexOf('booking_id') !== -1);

    queryRunner.dropForeignKey(TABLE.Rating, bookingForeignKey);
  }
}
