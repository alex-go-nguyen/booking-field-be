import { Controller, Delete, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { CloudinaryService } from './cloudinary.service';

@ApiTags('Upload')
@Controller('upload')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.cloudinaryService.uploadFile(file);
  }

  @Delete('files/:id')
  deleteImage(@Param('id') id: string) {
    return this.cloudinaryService.deleteFile(id);
  }
}
