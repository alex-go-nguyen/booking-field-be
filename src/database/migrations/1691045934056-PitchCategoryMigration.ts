import { TABLES } from 'src/common/constants';
import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey, TableIndex } from 'typeorm';

export class PitchCategoryMigration1691045934056 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: TABLES.pitchCategory,
        columns: [
          {
            name: '_id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'description',
            type: 'varchar',
          },
          {
            name: 'thumbnail',
            type: 'varchar',
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

    await queryRunner.createIndex(
      TABLES.pitchCategory,
      new TableIndex({
        name: 'pitchName-idx',
        columnNames: ['name'],
      }),
    );

    await queryRunner.addColumn(
      TABLES.pitch,
      new TableColumn({
        name: 'pitchCategory_id',
        type: 'int',
      }),
    );

    await queryRunner.createForeignKey(
      TABLES.pitch,
      new TableForeignKey({
        columnNames: ['pitchCategory_id'],
        referencedColumnNames: ['_id'],
        referencedTableName: TABLES.pitchCategory,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(TABLES.pitchCategory, 'name-idx');
    await queryRunner.dropTable(TABLES.pitchCategory);
  }
}
