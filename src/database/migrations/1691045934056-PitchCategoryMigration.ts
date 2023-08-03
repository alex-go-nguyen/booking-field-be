import { TABLE } from 'src/common/enums/table.enum';
import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey, TableIndex } from 'typeorm';

export class PitchCategoryMigration1691045934056 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: TABLE.PitchCategory,
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
            default: 'now()',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      TABLE.PitchCategory,
      new TableIndex({
        name: 'pitchName-idx',
        columnNames: ['name'],
      }),
    );

    await queryRunner.addColumn(
      TABLE.Pitch,
      new TableColumn({
        name: 'pitchCategory_id',
        type: 'int',
      }),
    );

    await queryRunner.createForeignKey(
      TABLE.Pitch,
      new TableForeignKey({
        columnNames: ['pitchCategory_id'],
        referencedColumnNames: ['_id'],
        referencedTableName: TABLE.PitchCategory,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(TABLE.PitchCategory, 'name-idx');
    await queryRunner.dropTable(TABLE.PitchCategory);
  }
}
