import { Test } from '@nestjs/testing';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { Role, AccountType } from 'src/generated/prisma/client';
import { AuthGuard } from 'src/auth/auth.guards';

describe('ClientsController', () => {
  let clientsController: ClientsController;
  let clientsService: ClientsService;

  const mockClientsService = {
    getClients: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [ClientsController],
      providers: [
        {
          provide: ClientsService,
          useValue: mockClientsService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .compile();

    clientsController = module.get<ClientsController>(ClientsController);
    clientsService = module.get<ClientsService>(ClientsService);

    jest.clearAllMocks();
  });

  describe('getClients', () => {
    it('should return an array of clients', async () => {
      const result = {
        meta: {
          total: 2,
          page: 1,
          pageTotal: 1,
        },
        data: [
          {
            id: '1',
            name: 'Client 1',
            companyName: 'Company 1',
            phone: '11111111111',
            email: 'client1@email.com',
            createdAt: new Date(),
          },
          {
            id: '2',
            name: 'Client 2',
            companyName: 'Company 2',
            phone: '22222222222',
            email: 'client2@email.com',
            createdAt: new Date(),
          },
        ],
      };

      const pagination = {
        page: 1,
      };

      const user = {
        sub: 'user-1',
        name: 'Guilherme',
        email: 'gui@email.com',
        role: Role.CEO,
        organizationId: 'org-1',
        organizationName: 'Organization 1',
        artistId: null,
        accountType: AccountType.AGENCY,
      };

      jest.spyOn(clientsService, 'getClients').mockResolvedValue(result);

      const response = await clientsController.getClients(pagination, user);

      expect(response).toEqual(result);

      expect(mockClientsService.getClients).toHaveBeenCalledWith(
        user,
        pagination,
      );
    });
  });
});
