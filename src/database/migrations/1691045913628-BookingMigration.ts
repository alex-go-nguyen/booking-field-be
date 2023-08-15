import { TABLES } from 'src/common/constants';
import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';

export class BookingMigration1691045913628 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: TABLES.booking,
        columns: [
          {
            name: '_id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'startTime',
            type: 'timestamptz',
          },
          {
            name: 'endTime',
            type: 'timestamptz',
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

    await queryRunner.addColumns(TABLES.booking, [
      new TableColumn({
        name: 'pitch_id',
        type: 'int',
      }),
      new TableColumn({
        name: 'user_id',
        type: 'int',
      }),
    ]);

    await queryRunner.createForeignKey(
      TABLES.booking,
      new TableForeignKey({
        columnNames: ['pitch_id'],
        referencedColumnNames: ['_id'],
        referencedTableName: TABLES.pitch,
      }),
    );

    await queryRunner.createForeignKey(
      TABLES.booking,
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['_id'],
        referencedTableName: TABLES.user,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable(TABLES.booking);
    const userForeignKey = table.foreignKeys.find((fk) => fk.columnNames.indexOf('user_id') !== -1);
    const pitchForeignKey = table.foreignKeys.find((fk) => fk.columnNames.indexOf('pitch_id') !== -1);
    const ratingForeignKey = table.foreignKeys.find((fk) => fk.columnNames.indexOf('rating_id') !== -1);

    queryRunner.dropForeignKeys(TABLES.booking, [userForeignKey, pitchForeignKey, ratingForeignKey]);
    queryRunner.dropTable(TABLES.booking);
  }
}
