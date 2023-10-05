import {
  Controller,
  Delete,
  HttpCode,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { CurrentUser } from 'src/user/user.decorator';
import { CloudinaryService } from './cloudinary.service';

@ApiTags('Upload')
@Controller('upload')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @ResponseMessage('Upload file successfully!')
  @Post('file')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(@UploadedFile() file: Express.Multer.File, @CurrentUser('id') userId: number) {
    return this.cloudinaryService.uploadImage({ userId, file });
  }

  @ResponseMessage('Upload files successfully!')
  @Post('files')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files', 10))
  uploadMultipleFiles(@UploadedFiles() files: Array<Express.Multer.File>, @CurrentUser('id') userId: number) {
    return this.cloudinaryService.uploadImages({
      userId,
      files,
    });
  }

  @HttpCode(204)
  @ResponseMessage('Delete file successfully!')
  @Delete('files/:id')
  @UseGuards(JwtAuthGuard)
  deleteImage(@Param('id') id: string) {
    return this.cloudinaryService.deleteFile(id);
  }
}
