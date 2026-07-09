import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CurrentUserDto } from 'src/auth/dtos/user.dto';
import { MonthSummaryResponseDto } from './dtos/month-summary-response-dto';
import { AccountType, Prisma, Role } from 'src/generated/prisma/client';

@Injectable()
export class FinancialService {
  constructor(private readonly prisma: PrismaService) {}

  async getFinancialSummary(
    user: CurrentUserDto,
    params?: { month?: number; year?: number; artistId?: string },
  ) {
    const now = new Date();

    const selectedYear = params?.year ?? now.getFullYear();
    const selectedMonth = params?.month ? params.month - 1 : now.getMonth();

    const firstDay = new Date(selectedYear, selectedMonth, 1);
    const lastDay = new Date(selectedYear, selectedMonth + 1, 0);

    const where: Prisma.EventWhereInput = {
      organizationId: user.organizationId,
      paymentDate: {
        gte: firstDay,
        lte: lastDay,
      },
    };

    if (user.role === Role.ARTIST && user.accountType === AccountType.AGENCY) {
      where.artistId = user.artistId;
    }

    if (user.role !== Role.ARTIST && params?.artistId) {
      where.artistId = params.artistId;
    }

    const monthSummary = await this.prisma.event.aggregate({
      where,
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
