export class MonthSummaryResponseDto {
  totalEvents: number;
  totalRevenue: number;
  averageFee: number;

  constructor(data: {
    _count: { _all: number };
    _sum: { fee: { toNumber(): number } | null };
    _avg: { fee: { toNumber(): number } | null };
  }) {
    this.totalEvents = data._count._all;
    this.totalRevenue = data._sum.fee?.toNumber() ?? 0;
    this.averageFee = data._avg.fee?.toNumber() ?? 0;
  }
}
