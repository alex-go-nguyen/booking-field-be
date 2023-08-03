import { Module } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryController } from './cloudinary.controller';
import { CloudinaryService } from './cloudinary.service';

@Module({
  imports: [],
  providers: [
    CloudinaryService,
    {
      provide: 'CLOUDINARY',
      useFactory: () => {
        return cloudinary.config({
          cloud_name: process.env.CLOUDINARY_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
        });
      },
    },
  ],
  controllers: [CloudinaryController],
})
export class CloudinaryModule {}
