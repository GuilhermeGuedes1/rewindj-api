import { Test } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { AuthGuard } from 'src/auth/auth.guards';
import { AccountType, EventStatus, Role } from 'src/generated/prisma/enums';

describe('EventsController', () => {
  let eventsController: EventsController;
  let eventsService: EventsService;

  const canActivate = jest.fn(() => true);

  const mockEventsService = {
    getEvents: jest.fn(),
    getDashboardSummary: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [
        {
          provide: EventsService,
          useValue: mockEventsService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate })
      .compile();

    eventsController = module.get<EventsController>(EventsController);
    eventsService = module.get<EventsService>(EventsService);

    jest.clearAllMocks();
  });

  describe('getEvents', () => {
    it('Should return an array of events', async () => {
      const result = {
        meta: {
          page: 1,
          limit: 2,
          count: 10,
          pageTotal: 100,
        },
        data: [
          {
            id: '1',
            title: 'Baile do Chris Roc',
            eventDate: new Date(),
            startTime: '10:00',
            endTime: '14:00',
            venueName: 'Vinyl Shop',
            address: 'Rua do Rio',
            city: 'Rio de janeiro',
            state: 'RJ',
            status: EventStatus.CONFIRMED,
            fee: 3000,
            notes: 'Obeservação',

            client: {
              id: '1',
              name: 'Barbara',
              phone: '21 99999-1111',
              email: 'barbara@email.com',
            },
            artist: {
              id: '1',
              name: 'Guilherme',
              stageName: 'Dj Chris roc',
              email: 'djchrisroc@gmail.com',
            },
          },
          {
            id: '1',
            title: 'Baile do Chris Roc',
            eventDate: new Date(),
            startTime: '10:00',
            endTime: '14:00',
            venueName: 'Vinyl Shop',
            address: 'Rua do Rio',
            city: 'Rio de janeiro',
            state: 'RJ',
            status: EventStatus.NEGOTIATING,
            eventStatus: 'em negociação',
            fee: 3000,
            notes: 'Obeservação',

            client: {
              id: '1',
              name: 'Barbara',
              phone: '21 99999-1111',
              email: 'barbara@email.com',
            },
            artist: {
              id: '1',
              name: 'Guilherme',
              stageName: 'Dj Chris roc',
              email: 'djchrisroc@gmail.com',
            },
          },
        ],
      };

      const pagination = { page: 1 };
      const user = {
        sub: '1',
        name: 'Guilherme',
        email: 'guilherme@email.com',
        role: Role.CEO,
        organizationId: '1',
        organizationName: 'Oganization1',
        artistId: '1',
        accountType: AccountType.INDEPENDENT_ARTIST,
      };

      jest.spyOn(eventsService, 'getEvents').mockResolvedValue(result);
      const response = await eventsController.getEvents(pagination, user);
      expect(response).toEqual(result);
      expect(mockEventsService.getEvents).toHaveBeenCalledWith(
        user,
        pagination,
      );
    });
  });

  describe('dashboard Summary', () => {
    it('Should return a summary about events', async () => {
      const result = {
        confirmedEvents: 1,
        negotiatingEvents: 2,
        nextEvent: {
          id: 'event-1',
          title: 'Casamento',
          eventDate: new Date(),
          startTime: null,
          endTime: null,
          setDuration: null,
          venueName: null,
          address: null,
          city: null,
          state: null,
          status: EventStatus.CONFIRMED,
          fee: null,
          paymentDate: null,
          paymentMethod: null,
          hasContract: false,
          notes: null,
          artistId: 'artist-1',
          clientId: 'client-1',
          organizationId: 'organization-1',
          createdAt: new Date(),
          updatedAt: new Date(),
          client: {
            id: 'client-1',
            name: 'João',
            companyName: null,
            phone: null,
            email: null,
            organizationId: 'organization-1',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          artist: {
            id: 'artist-1',
            name: 'Guilherme',
            stageName: 'DJ Gui',
          },
        },
      };

      const user = {
        sub: '1',
        name: 'Guilherme',
        email: 'guilherme@email.com',
        role: Role.CEO,
        organizationId: '1',
        organizationName: 'Oganization1',
        artistId: '1',
        accountType: AccountType.INDEPENDENT_ARTIST,
      };

      jest
        .spyOn(eventsService, 'getDashboardSummary')
        .mockResolvedValue(result);

      const response = await eventsController.getDashboardSummary(user);

      expect(response).toEqual(result);
      expect(mockEventsService.getDashboardSummary).toHaveBeenCalledWith(user);
    });
  });
});
