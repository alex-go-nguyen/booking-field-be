import { Base } from 'src/common/entities/base.entity';
import { TABLE } from 'src/common/enums/table.enum';
import { strToSlug } from 'src/common/utils';
import { Pitch } from 'src/pitch/entities/pitch.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import { ILocation } from '../interfaces/location.interface';
import { VenueImage } from '../interfaces/venue-image.interface';

@Entity(TABLE.Venue)
export class Venue extends Base {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column('jsonb')
  location: ILocation;

  @Column()
  address: string;

  @Column()
  province: string;

  @Column()
  district: string;

  @Column('jsonb', { nullable: true })
  imageList: VenueImage[];

  @Column({ type: 'time' })
  openAt: string;

  @Column({ type: 'time' })
  closeAt: string;

  @Column({ type: 'text' })
  slug: string;

  @OneToMany(() => Pitch, (pitch) => pitch.venue)
  pitches: Pitch[];

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    this.slug = strToSlug(this.name);
  }
}
