import { BASE_COLUMNS, TABLES } from 'src/common/constants';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class ForgottenPasswordMigrations1693292029745 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: TABLES.forgottenPassword,
        columns: [
          { name: 'email', type: 'varchar' },
          {
            name: 'resetToken',
            type: 'varchar',
          },
          {
            name: 'expiredAt',
            type: 'timestamp',
          },
          ...BASE_COLUMNS,
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(TABLES.forgottenPassword);
  }
}
