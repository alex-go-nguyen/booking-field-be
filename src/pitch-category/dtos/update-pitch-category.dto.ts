import { PartialType } from '@nestjs/swagger';
import { CreatePitchCategoryDto } from './create-pitch-category.dto';

export class UpdatePitchCategoryDto extends PartialType(CreatePitchCategoryDto) {}
