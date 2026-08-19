import { Injectable } from '@nestjs/common';
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
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
    fileKey: string,
    fileContent: Buffer,
    contentType: string,
  ) {
    const key = `users/${uuidv4()}-${fileKey}`;

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
