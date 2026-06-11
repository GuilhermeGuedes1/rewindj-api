import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { OrganizationModule } from './organization/organization.module';
import { InvitesModule } from './invites/invites.module';
import { AiModule } from './ai/ai.module';
import { EventsModule } from './events/events.module';
import { ClientsModule } from './clients/clients.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    OrganizationModule,
    InvitesModule,
    AiModule,
    EventsModule,
    ClientsModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
