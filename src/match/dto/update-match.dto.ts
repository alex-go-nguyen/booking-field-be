import { PartialType } from '@nestjs/swagger';
import { Match } from '../entities/match.entity';

export class UpdateMatchDto extends PartialType(Match) {}
