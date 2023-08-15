import { TABLES } from 'src/common/constants';
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateUserMigration1691383583861 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(TABLES.user, new TableColumn({ name: 'stripeCustomerId', type: 'varchar' }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(TABLES.user, 'stripeCustomerId');
  }
}
