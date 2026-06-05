import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { OrganizationModule } from './organization/organization.module';

@Module({
  imports: [AuthModule, PrismaModule, OrganizationModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
