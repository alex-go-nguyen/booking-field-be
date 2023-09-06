import { PartialType } from '@nestjs/swagger';
import { Pitch } from '../entities/pitch.entity';

export class UpdatePitchDto extends PartialType(Pitch) {}
