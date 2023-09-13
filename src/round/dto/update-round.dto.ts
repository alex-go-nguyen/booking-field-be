import { PartialType } from '@nestjs/swagger';
import { Round } from '../entities/round.entity';
import { CreateRoundDto } from './create-round.dto';

export class UpdateRoundDto extends PartialType(Round) {}
