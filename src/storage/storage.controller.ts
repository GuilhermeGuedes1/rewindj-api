import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { StorageService } from './storage.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post()
  @UseInterceptors(FileInterceptor('cover'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.storageService.uploadFile(
      process.env.AWS_BUCKET_NAME!,
      file.originalname,
      file.buffer,
    );
  }
}
