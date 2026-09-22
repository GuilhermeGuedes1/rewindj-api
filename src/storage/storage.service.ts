import { Injectable } from '@nestjs/common';
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class StorageService {
  constructor(private readonly s3Client: S3Client) {}

  async getFile(bucketName: string, fileKey: string | null) {
    if (!fileKey) {
      return null;
    }

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
    });

    return getSignedUrl(this.s3Client, command, {
      expiresIn: 3600,
    });
  }

  async uploadFile(
    bucketName: string,
    fileContent: Buffer,
    contentType: string,
  ) {
    const extension = contentType.split('/')[1];
    const key = `artists/profile-images/${randomUUID()}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: fileContent,
      ContentType: contentType,
    });

    try {
      await this.s3Client.send(command);
      return key;
    } catch (error) {
      console.error('Error uploading file to S3:', error);
    }
  }
}
