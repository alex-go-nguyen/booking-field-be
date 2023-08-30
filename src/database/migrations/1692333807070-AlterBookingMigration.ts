import { TABLES } from 'src/common/constants';
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterBookingMigration1692333807070 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      TABLES.booking,
      new TableColumn({
        name: 'totalPrice',
        type: 'int',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(TABLES.booking, 'totalPrice');
  }
}
