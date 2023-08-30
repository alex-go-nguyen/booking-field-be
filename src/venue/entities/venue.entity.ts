import { TABLES } from 'src/common/constants';
import { Base } from 'src/common/entities/base.entity';
import { strToSlug } from 'src/common/utils';
import { Pitch } from 'src/pitch/entities/pitch.entity';
import User from 'src/user/entities/user.entity';
import { BeforeInsert, Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { Location } from '../interfaces/location.interface';
import { VenueImage } from '../interfaces/venue-image.interface';

@Entity(TABLES.venue)
export class Venue extends Base {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column('jsonb')
  location: Location;

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

  @OneToOne(() => User, (user) => user.venue)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @BeforeInsert()
  generateSlug() {
    this.slug = strToSlug(this.name);
  }
}
