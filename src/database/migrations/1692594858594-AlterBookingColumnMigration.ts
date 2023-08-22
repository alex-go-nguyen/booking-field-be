import { TABLES } from 'src/common/constants';
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterBookingColumnMigration1692594858594 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      TABLES.booking,
      'total_price',
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
