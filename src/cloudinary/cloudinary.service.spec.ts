import { UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { UploadApiOptions, UploadApiResponse, UploadResponseCallback, UploadStream } from 'cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryService } from './cloudinary.service';

describe('CloudinaryService', () => {
  let service: CloudinaryService;
  let configService: ConfigService;

  beforeEach(async () => {
    const cloudinaryModule: TestingModule = await Test.createTestingModule({
      providers: [
        CloudinaryService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key) => {
              if (key === 'NODE_ENV') {
                return 'test';
              }
              // Add any other environment-specific configuration values as needed.
            }),
          },
        },
      ],
    }).compile();

    service = cloudinaryModule.get<CloudinaryService>(CloudinaryService);
    configService = cloudinaryModule.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadImage', () => {
    it('should upload an image', async () => {
      const mockUploadResponse = {
        public_id: 'test-public-id',
        secure_url: 'https://example.com/test-image.jpg',
      } as UploadApiResponse;

      const mockFile = {
        buffer: Buffer.from('fake-image-data'),
      } as Express.Multer.File;
      const callbackfn: any = (options, callback) => {
        callback(null, mockUploadResponse) as UploadResponseCallback;
      };

      jest.spyOn(cloudinary.uploader, 'upload_stream').mockImplementation(callbackfn);

      const result = await service.uploadImage({
        userId: 1,
        file: mockFile,
      });

      expect(result).toEqual(mockUploadResponse);
      expect(cloudinary.uploader.upload_stream).toHaveBeenCalledWith(
        {
          folder: 'test/1',
        },
        expect.any(Function),
      );
    });

    it('should throw UnprocessableEntityException on upload error', async () => {
      const mockFile = {
        buffer: Buffer.from('fake-image-data'),
      } as Express.Multer.File;

      const callbackfn: any = (options, callback) => {
        callback(new Error('Upload failed'));
      };

      jest.spyOn(cloudinary.uploader, 'upload_stream').mockImplementation(callbackfn);

      await expect(async () => {
        await service.uploadImage({
          userId: 1,
          file: mockFile,
        });
      }).rejects.toThrow(UnprocessableEntityException);
    });
  });

  describe('uploadImages', () => {
    it('should upload multiple images', async () => {
      const mockFile1 = {
        buffer: Buffer.from('fake-image-data-1'),
      } as Express.Multer.File;

      const mockFile2 = {
        buffer: Buffer.from('fake-image-data-2'),
      } as Express.Multer.File;

      const mockUploadResponse1 = {
        public_id: 'test-public-id-1',
        secure_url: 'https://example.com/test-image-1.jpg',
      } as UploadApiResponse;

      const mockUploadResponse2 = {
        public_id: 'test-public-id-2',
        secure_url: 'https://example.com/test-image-2.jpg',
      } as UploadApiResponse;

      jest
        .spyOn(service, 'uploadImage')
        .mockResolvedValueOnce(mockUploadResponse1)
        .mockResolvedValueOnce(mockUploadResponse2);

      const result = await service.uploadImages({
        userId: 1,
        files: [mockFile1, mockFile2],
      });

      expect(result).toEqual([mockUploadResponse1, mockUploadResponse2]);
    });
  });

  describe('deleteFile', () => {
    it('should delete a file', async () => {
      const mockFileId = 'test-public-id';

      jest.spyOn(cloudinary.uploader, 'destroy').mockResolvedValue({ result: 'ok' });

      await service.deleteFile(mockFileId);

      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith(mockFileId);
    });
  });
});
