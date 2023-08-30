import { BASE_COLUMNS, TABLES } from 'src/common/constants';
import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey, TableIndex } from 'typeorm';

export class PitchCategoryMigration1691045934056 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: TABLES.pitchCategory,
        columns: [
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
          ...BASE_COLUMNS,
        ],
      }),
      true,
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
        referencedColumnNames: ['id'],
        referencedTableName: TABLES.pitchCategory,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tablePitch = await queryRunner.getTable(TABLES.pitch);
    const pitchCategoryFk = tablePitch.foreignKeys.find((fk) => fk.columnNames.indexOf('pitchCategory_id') !== -1);

    await queryRunner.dropForeignKey(TABLES.pitch, pitchCategoryFk);

    await queryRunner.dropTable(TABLES.pitchCategory);
  }
}
