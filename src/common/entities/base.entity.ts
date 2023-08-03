import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Base {
  @ApiProperty()
  @Expose()
  @PrimaryGeneratedColumn()
  _id: number;

  @ApiProperty()
  @Expose()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  @UpdateDateColumn()
  updatedAt: Date;
}
