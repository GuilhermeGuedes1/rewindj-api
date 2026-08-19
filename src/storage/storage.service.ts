import { Injectable } from '@nestjs/common';
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StorageService {
  constructor(private readonly s3Client: S3Client) {}

  async getFile(bucketName: string, fileKey: string) {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
    });

    try {
      const response = await this.s3Client.send(command);
      return response.Body;
    } catch (error) {
      console.error('Error fetching file from S3:', error);
    }
  }

  async uploadFile(bucketName: string, fileKey: string, fileContent: Buffer) {
    const key = `users/${uuidv4()}-${fileKey}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: fileContent,
    });

    try {
      await this.s3Client.send(command);
      return key;
    } catch (error) {
      console.error('Error uploading file to S3:', error);
    }
  }
}
