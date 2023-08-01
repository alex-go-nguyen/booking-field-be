import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Base {
  @ApiProperty()
  @Expose()
  @PrimaryGeneratedColumn()
  _id: string;

  @ApiProperty()
  @Expose()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty()
  @Expose()
  @DeleteDateColumn()
  deletedAt: Date;
}
