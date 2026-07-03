import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { OrganizationModule } from './organization/organization.module';
import { InvitesModule } from './invites/invites.module';
import { EventsModule } from './events/events.module';
import { ClientsModule } from './clients/clients.module';
import { AiModule } from './ai/ai.module';
import { ArtistsModule } from './artists/artists.module';
import { HealthModuleModule } from './health-module/health-module.module';

import { ConfigModule } from '@nestjs/config';
import { FinancialModule } from './financial/financial.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    PrismaModule,
    OrganizationModule,
    InvitesModule,
    EventsModule,
    ClientsModule,
    AiModule,
    ArtistsModule,
    HealthModuleModule,
    FinancialModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
