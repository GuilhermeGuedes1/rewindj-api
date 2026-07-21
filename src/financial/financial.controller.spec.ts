import { Test } from '@nestjs/testing';
import { FinancialController } from './financial.controller';
import { FinancialService } from './financial.service';
import { AuthGuard } from 'src/auth/auth.guards';
import { AccountType, Role } from 'src/generated/prisma/enums';

describe('FinancialController', () => {
  let financialController: FinancialController;
  let financialService: FinancialService;

  const useValue = jest.fn(() => true);

  const mockFinancialService = {
    getFinancialSummary: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [FinancialController],
      providers: [
        {
          provide: FinancialService,
          useValue: mockFinancialService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ useValue })
      .compile();

    financialController = module.get<FinancialController>(FinancialController);
    financialService = module.get<FinancialService>(FinancialService);

    jest.clearAllMocks();
  });

  describe('getFinancialSummary', () => {
    it('should return a financial resume', async () => {
      const result = {
        totalEvents: 1,
        totalRevenue: 4000,
        averageFee: 2000,
      };

      const user = {
        sub: '1',
        name: 'guilherme',
        email: 'guilherme@gmail.com',
        role: Role.ARTIST,
        organizationId: '1',
        organizationName: 'Organização 1',
        artistId: '1',
        accountType: AccountType.INDEPENDENT_ARTIST,
      };

      jest
        .spyOn(financialService, 'getFinancialSummary')
        .mockResolvedValue(result);

      const response = await financialController.getFinancialData(
        user,
        '7',
        '2026',
      );

      expect(response).toEqual(result);

      expect(mockFinancialService.getFinancialSummary).toHaveBeenCalledWith(
        user,
        { month: 7, year: 2026 },
      );
    });
  });
});
