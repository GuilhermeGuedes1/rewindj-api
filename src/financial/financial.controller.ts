import { Controller, Get } from '@nestjs/common';
import { FinancialService } from './financial.service';
import { CurrentUserDto } from 'src/auth/dtos/user.dto';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guards';
import { MonthSummaryResponseDto } from './dtos/month-summary-response-dto';

@UseGuards(AuthGuard)
@Controller('financial')
export class FinancialController {
  constructor(private readonly financialService: FinancialService) {}
  @Get('summary')
  getFinancialData(
    @CurrentUser() user: CurrentUserDto,
  ): Promise<MonthSummaryResponseDto> {
    return this.financialService.getFinancialSummary(user);
  }
}
