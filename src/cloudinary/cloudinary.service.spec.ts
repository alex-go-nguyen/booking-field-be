import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryService } from './cloudinary.service';

jest.mock('buffer-to-stream');
jest.mock('cloudinary');

describe('CloudinaryService', () => {
  let cloudinaryService: CloudinaryService;
  let configService: ConfigService;

  const mockFile = {
    fieldname: 'image',
    originalname: 'test.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    buffer: Buffer.from([1, 2, 3]), // Mocked file content
    size: 12345,
    destination: '',
    filename: '',
    path: '',
  } as Express.Multer.File;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CloudinaryService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key) => {
              if (key === 'NODE_ENV') {
                return 'test'; // Adjust this value according to your environment
              }
            }),
          },
        },
      ],
    }).compile();

    cloudinaryService = module.get<CloudinaryService>(CloudinaryService);
    configService = module.get<ConfigService>(ConfigService);
  });

  // describe('uploadImage', () => {
  //   it('should upload an image to Cloudinary', async () => {
  //     const userId = 1;

  //     const uploadApiResponse = {
  //       public_id: 'image_id',
  //       secure_url: 'https://example.com/image.jpg',
  //       created_at: '2023-01-01T12:00:00Z',
  //     };

  //     cloudinary.uploader.upload_stream = jest.fn((options, callback) => {
  //       callback(null, uploadApiResponse);
  //     });

  //     const result = await cloudinaryService.uploadImage({ userId, file: mockFile });

  //     expect(cloudinary.uploader.upload_stream).toHaveBeenCalledWith(
  //       {
  //         folder: 'test/1',
  //       },
  //       expect.any(Function),
  //     );
  //     expect(result).toEqual(uploadApiResponse);
  //   });

  //   it('should throw an UnprocessableEntityException when Cloudinary upload fails', async () => {
  //     const userId = 1;

  //     const errorMessage = 'Error uploading image';

  //     cloudinary.uploader.upload_stream = jest.fn((options, callback) => {
  //       callback(new Error(errorMessage), null);
  //     });

  //     await expect(cloudinaryService.uploadImage({ userId, file: mockFile })).rejects.toThrowError(
  //       UnprocessableEntityException,
  //     );
  //   });
  // });

  // describe('uploadImages', () => {
  //   it('should upload multiple images to Cloudinary', async () => {
  //     const userId = 1;

  //     const uploadApiResponse = {
  //       public_id: 'image_id',
  //       secure_url: 'https://example.com/image.jpg',
  //       created_at: '2023-01-01T12:00:00Z',
  //     };

  //     cloudinary.uploader.upload_stream = jest.fn((options, callback) => {
  //       callback(null, uploadApiResponse);
  //     });

  //     const files = [mockFile, mockFile, mockFile]; // Mocked array of files
  //     const result = await cloudinaryService.uploadImages({ userId, files });

  //     expect(cloudinary.uploader.upload_stream).toHaveBeenCalledTimes(files.length);
  //     expect(result).toHaveLength(files.length);
  //     for (const item of result) {
  //       expect(item).toEqual(uploadApiResponse);
  //     }
  //   });
  // });

  describe('deleteFile', () => {
    it('should delete a file from Cloudinary', async () => {
      const fileId = 'image_id';

      cloudinary.uploader.destroy = jest.fn();

      await cloudinaryService.deleteFile(fileId);

      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith(fileId);
    });
  });
});
