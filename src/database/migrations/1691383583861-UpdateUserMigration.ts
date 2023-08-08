import { TABLE } from 'src/common/enums/table.enum';
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateUserMigration1691383583861 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(TABLE.User, new TableColumn({ name: 'stripeCustomerId', type: 'varchar' }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(TABLE.User, 'stripeCustomerId');
  }
}
