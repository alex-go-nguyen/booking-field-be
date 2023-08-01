import { PartialType } from '@nestjs/swagger';
import { CreateSubFieldDto } from './create-sub-field.dto';

export class UpdateSubFieldDto extends PartialType(CreateSubFieldDto) {}
