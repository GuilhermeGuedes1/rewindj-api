import { Test } from '@nestjs/testing';
import { ArtistsController } from './artists.controller';
import { ArtistsService } from './artists.service';
import { AuthGuard } from 'src/auth/auth.guards';
import { Role } from 'src/generated/prisma/enums';
import { AccountType } from 'src/generated/prisma/enums';

describe('ArtistController', () => {
  let artistController: ArtistsController;
  let artistService: ArtistsService;

  const mockArtistService = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [ArtistsController],
      providers: [
        {
          provide: ArtistsService,
          useValue: mockArtistService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .compile();

    artistController = module.get<ArtistsController>(ArtistsController);
    artistService = module.get<ArtistsService>(ArtistsService);

    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of artists', async () => {
      const result = [
        {
          id: '1',
          name: 'Guilherme',
          stageName: 'Dj Chris Roc',
          birthDate: new Date(),
          phone: '21 98989-2121',
          email: 'djchrisroc@gmail.com',
          address: 'Rua do rio',
          city: 'Rio de janeiro',
          state: 'RJ',
          pixKey: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          name: 'Cristian',
          stageName: 'Dj Roc',
          birthDate: new Date(),
          phone: '21 99999-2222',
          email: 'roc@gmail.com',
          address: 'Rua do rio',
          city: 'Rio de janeiro',
          state: 'RJ',
          pixKey: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

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
      jest.spyOn(artistService, 'findAll').mockResolvedValue(result);

      const response = await artistController.findAll(user);

      expect(response).toEqual(result);

      expect(mockArtistService.findAll).toHaveBeenCalledWith(user);
    });
  });
});
