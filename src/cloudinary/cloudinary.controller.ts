import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import User from 'src/user/entities/user.entity';
import { CloudinaryService } from './cloudinary.service';

@ApiTags('Upload')
@Controller('upload')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('file')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File, @Req() req) {
    const user: User = req['user'];

    const data = await this.cloudinaryService.uploadImage({ userId: user._id, file });

    return { data };
  }

  @Post('files')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadMultipleFiles(@UploadedFiles() files: Array<Express.Multer.File>, @Req() req) {
    const user: User = req['user'];

    const data = await this.cloudinaryService.uploadImages({
      userId: user._id,
      files,
    });

    return { data };
  }

  @HttpCode(204)
  @Delete('files/:id')
  deleteImage(@Param('id') id: string) {
    return this.cloudinaryService.deleteFile(id);
  }
}
