import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CurrentUserDto } from 'src/auth/dtos/user.dto';
import { MonthSummaryResponseDto } from './dtos/month-summary-response-dto';

@Injectable()
export class FinancialService {
  constructor(private readonly prisma: PrismaService) {}

  async getFinancialSummary(user: CurrentUserDto) {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const monthSummary = await this.prisma.event.aggregate({
      where: {
        organizationId: user.organizationId,
        paymentDate: {
          gte: firstDay,
          lte: lastDay,
        },
      },
      _sum: {
        fee: true,
      },
      _count: {
        _all: true,
      },
      _avg: {
        fee: true,
      },
    });

    return new MonthSummaryResponseDto(monthSummary);
  }
}
