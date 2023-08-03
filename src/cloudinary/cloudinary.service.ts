import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import { CloudinaryResponse } from './interfaces/cloudinary-response.interface';

@Injectable()
export class CloudinaryService {
  uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream((error, result) => {
        if (error) return reject(error);
        resolve(result);
      });

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async deleteFile(id: string) {
    await cloudinary.uploader.destroy(id);
  }
}
