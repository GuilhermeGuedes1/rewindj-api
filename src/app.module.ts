import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { OrganizationModule } from './organization/organization.module';
import { InvitesModule } from './invites/invites.module';
import { EventsModule } from './events/events.module';
import { ClientsModule } from './clients/clients.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    OrganizationModule,
    InvitesModule,
    EventsModule,
    ClientsModule,
    AiModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
