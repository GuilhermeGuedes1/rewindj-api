import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { StorageService } from './storage.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/guards/auth.guards';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('profile-image')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('profileImage'))
  uploadProfileImage(@UploadedFile() file: Express.Multer.File) {
    return this.storageService.uploadFile(
      process.env.AWS_BUCKET_NAME!,
      file.originalname,
      file.buffer,
      file.mimetype,
    );
  }
}
