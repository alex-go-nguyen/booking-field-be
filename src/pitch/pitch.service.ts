import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services/base.service';
import { Repository } from 'typeorm';
import { Pitch } from './entities/pitch.entity';

@Injectable()
export class PitchService extends BaseService<Pitch, unknown> {
  constructor(@InjectRepository(Pitch) private pitchRepository: Repository<Pitch>) {
    super(pitchRepository);
  }
}
