import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import toStream = require('buffer-to-stream');
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

interface IUploadImage {
  userId: number;
  file: Express.Multer.File;
}

interface IUploadImages extends Omit<IUploadImage, 'file'> {
  files: Array<Express.Multer.File>;
}

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {}

  async uploadImage({ userId, file }: IUploadImage): Promise<UploadApiResponse> {
    const environment = this.configService.get('NODE_ENV');
    return new Promise((resolve) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder: `${environment}/${userId}`,
        },
        (error, result) => {
          if (error) throw new UnprocessableEntityException(error.message);
          resolve(result);
        },
      );

      toStream(file.buffer).pipe(upload);
    });
  }

  async uploadImages({ userId, files }: IUploadImages): Promise<UploadApiResponse[]> {
    const promiseUploadImages = files.map((file) =>
      this.uploadImage({
        userId,
        file,
      }),
    );

    return await Promise.all(promiseUploadImages);
  }

  async deleteFile(id: string) {
    await cloudinary.uploader.destroy(id);
  }
}
