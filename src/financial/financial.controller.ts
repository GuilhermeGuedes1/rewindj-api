import { Controller, Get, Query } from '@nestjs/common';
import { FinancialService } from './financial.service';
import { CurrentUserDto } from 'src/auth/dtos/user.dto';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guards';
import { MonthSummaryResponseDto } from './dtos/month-summary-response-dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiQuery,
} from '@nestjs/swagger';

@UseGuards(AuthGuard)
@Controller('financial')
export class FinancialController {
  constructor(private readonly financialService: FinancialService) {}

  @ApiQuery({
    name: 'month',
    required: false,
    example: 7,
    description: 'Month (1-12)',
  })
  @ApiQuery({
    name: 'year',
    required: false,
    example: 2026,
    description: 'Year',
  })
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get the authenticated user profile',
    description:
      'Returns the identity and tenant context decoded from the current JWT.',
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid bearer token.' })
  @UseGuards(AuthGuard)
  @Get('summary')
  getFinancialData(
    @CurrentUser() user: CurrentUserDto,
    @Query('month') month?: string,
    @Query('year') year?: string,
  ): Promise<MonthSummaryResponseDto> {
    return this.financialService.getFinancialSummary(user, {
      month: month ? Number(month) : undefined,
      year: year ? Number(year) : undefined,
    });
  }
}
