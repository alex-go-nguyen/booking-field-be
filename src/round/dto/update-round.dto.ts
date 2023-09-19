import { PartialType } from '@nestjs/swagger';
import { Round } from '../entities/round.entity';

export class UpdateRoundDto extends PartialType(Round) {}
