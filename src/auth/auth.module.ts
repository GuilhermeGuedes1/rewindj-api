import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './strategies/google.strategy';

import { StorageModule } from 'src/storage/storage.module';

@Module({
  providers: [AuthService, GoogleStrategy],
  controllers: [AuthController],
  imports: [PassportModule, StorageModule],
})
export class AuthModule {}
