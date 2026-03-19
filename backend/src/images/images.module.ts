import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './image.entity';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { S3UploadService } from './s3-upload.service';

@Module({
  imports: [TypeOrmModule.forFeature([Image])],
  providers: [ImagesService, S3UploadService],
  controllers: [ImagesController],
  exports: [ImagesService, S3UploadService],
})
export class ImagesModule {}
