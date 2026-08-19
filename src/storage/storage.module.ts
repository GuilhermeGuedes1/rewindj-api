import { Module } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';

import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';

@Module({
  providers: [
    StorageService,
    {
      provide: S3Client,
      useFactory: () => {
        return new S3Client({
          region: process.env.AWS_REGION,
        });
      },
    },
  ],
  exports: [StorageService],
  controllers: [StorageController],
})
export class StorageModule {}
