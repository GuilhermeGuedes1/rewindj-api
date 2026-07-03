import { Controller, Get } from '@nestjs/common';

@Controller('financial')
export class FinancialController {
  @Get()
  getFinancialData(): string {
    return 'Financial data retrieved successfully.';
  }
}
