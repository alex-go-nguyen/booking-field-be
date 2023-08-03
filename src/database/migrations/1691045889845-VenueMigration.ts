import { TABLE } from 'src/common/enums/table.enum';
import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class VenueMigration1691045889845 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: TABLE.Venue,
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
            name: 'location',
            type: 'json',
          },
          {
            name: 'description',
            type: 'varchar',
          },
          {
            name: 'address',
            type: 'varchar',
          },
          {
            name: 'province',
            type: 'varchar',
          },
          {
            name: 'district',
            type: 'varchar',
          },
          {
            name: 'imageList',
            type: 'json',
          },
          {
            name: 'openAt',
            type: 'varchar',
          },
          {
            name: 'closeAt',
            type: 'varchar',
          },
          {
            name: 'slug',
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
      TABLE.Venue,
      new TableIndex({
        name: 'venueName-idx',
        columnNames: ['name'],
      }),
    );
    await queryRunner.createIndex(
      TABLE.Venue,
      new TableIndex({
        name: 'address-idx',
        columnNames: ['address'],
      }),
    );
    await queryRunner.createIndex(
      TABLE.Venue,
      new TableIndex({
        name: 'province-idx',
        columnNames: ['province'],
      }),
    );
    await queryRunner.createIndex(
      TABLE.Venue,
      new TableIndex({
        name: 'district-idx',
        columnNames: ['district'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(TABLE.Venue, 'name-idx');
    await queryRunner.dropIndex(TABLE.Venue, 'address-idx');
    await queryRunner.dropIndex(TABLE.Venue, 'province-idx');
    await queryRunner.dropIndex(TABLE.Venue, 'district-idx');
    await queryRunner.dropTable(TABLE.Venue);
  }
}
