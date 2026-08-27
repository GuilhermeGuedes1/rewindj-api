import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import {
  EventStatus,
  InviteStatus,
  PaymentMethod,
  PrismaClient,
  Role,
} from '../src/generated/prisma/client';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is required to run the seed');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const agencyDocument = 'SEED-AGENCY-0001';
const password = 'RewindJ@123';

function dateAt(daysFromToday: number, hour = 20): Date {
  const date = new Date();

  date.setUTCHours(hour, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() + daysFromToday);

  return date;
}

async function removeSeedData() {
  const agency = await prisma.organization.findUnique({
    where: {
      document: agencyDocument,
    },
    select: {
      id: true,
    },
  });

  if (agency) {
    await prisma.$transaction([
      prisma.event.deleteMany({
        where: {
          organizationId: agency.id,
        },
      }),
      prisma.client.deleteMany({
        where: {
          organizationId: agency.id,
        },
      }),
      prisma.invite.deleteMany({
        where: {
          organizationId: agency.id,
        },
      }),
      prisma.artist.deleteMany({
        where: {
          organizationId: agency.id,
        },
      }),
      prisma.organization.delete({
        where: {
          id: agency.id,
        },
      }),
    ]);
  }

  const independentUser = await prisma.user.findUnique({
    where: {
      email: 'sol@rewindj.test',
    },
    select: {
      id: true,
    },
  });

  if (independentUser) {
    const independentArtist = await prisma.artist.findUnique({
      where: {
        userId: independentUser.id,
      },
      select: {
        id: true,
      },
    });

    if (independentArtist) {
      await prisma.$transaction([
        prisma.event.deleteMany({
          where: {
            artistId: independentArtist.id,
          },
        }),
        prisma.client.deleteMany({
          where: {
            artistId: independentArtist.id,
          },
        }),
        prisma.artist.delete({
          where: {
            id: independentArtist.id,
          },
        }),
      ]);
    }

    await prisma.user.delete({
      where: {
        id: independentUser.id,
      },
    });
  }
}

async function createAgencyScenario(passwordHash: string) {
  const agency = await prisma.organization.create({
    data: {
      name: 'RewindJ Demo Agency',
      document: agencyDocument,
      email: 'agency@rewindj.test',
    },
  });

  const ceoUser = await prisma.user.create({
    data: {
      email: 'ceo@rewindj.test',
      password: passwordHash,
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@rewindj.test',
      password: passwordHash,
    },
  });

  const producerUser = await prisma.user.create({
    data: {
      email: 'producer@rewindj.test',
      password: passwordHash,
    },
  });

  const marinaUser = await prisma.user.create({
    data: {
      email: 'marina@rewindj.test',
      password: passwordHash,
    },
  });

  const lucasUser = await prisma.user.create({
    data: {
      email: 'lucas@rewindj.test',
      password: passwordHash,
    },
  });

  const rafaUser = await prisma.user.create({
    data: {
      email: 'rafa@rewindj.test',
      password: passwordHash,
    },
  });

  const carla = await prisma.artist.create({
    data: {
      name: 'Carla CEO',
      stageName: 'Carla CEO',
      phone: '+5511999000001',
      role: Role.CEO,
      isIndependent: false,
      userId: ceoUser.id,
      organizationId: agency.id,
    },
  });

  const andre = await prisma.artist.create({
    data: {
      name: 'André Admin',
      stageName: 'André Admin',
      phone: '+5511999000002',
      role: Role.ADMIN,
      isIndependent: false,
      userId: adminUser.id,
      organizationId: agency.id,
    },
  });

  const paula = await prisma.artist.create({
    data: {
      name: 'Paula Producer',
      stageName: 'Paula Producer',
      phone: '+5511999000003',
      role: Role.PRODUCER,
      isIndependent: false,
      userId: producerUser.id,
      organizationId: agency.id,
    },
  });

  const marina = await prisma.artist.create({
    data: {
      name: 'Marina Costa',
      stageName: 'DJ Marina',
      phone: '+5511999000011',
      city: 'São Paulo',
      state: 'SP',
      pixKey: 'marina@rewindj.test',
      role: Role.ARTIST,
      isIndependent: false,
      userId: marinaUser.id,
      organizationId: agency.id,
    },
  });

  const lucas = await prisma.artist.create({
    data: {
      name: 'Lucas Mendes',
      stageName: 'DJ Lucas M',
      phone: '+5511999000012',
      city: 'São Paulo',
      state: 'SP',
      pixKey: 'lucas@rewindj.test',
      role: Role.ARTIST,
      isIndependent: false,
      userId: lucasUser.id,
      organizationId: agency.id,
    },
  });

  const rafa = await prisma.artist.create({
    data: {
      name: 'Rafa Nunes',
      stageName: 'DJ Rafa Nunes',
      phone: '+5511999000013',
      city: 'Campinas',
      state: 'SP',
      pixKey: 'rafa@rewindj.test',
      role: Role.ARTIST,
      isIndependent: false,
      userId: rafaUser.id,
      organizationId: agency.id,
    },
  });

  const [sunset, aurora, casa] = await prisma.$transaction([
    prisma.client.create({
      data: {
        name: 'Sunset Club',
        companyName: 'Sunset Entretenimento Ltda.',
        email: 'booking@sunset.test',
        phone: '+5511988110001',
        organizationId: agency.id,
      },
    }),

    prisma.client.create({
      data: {
        name: 'Festival Aurora',
        companyName: 'Aurora Produções',
        email: 'contato@aurora.test',
        phone: '+5511988110002',
        organizationId: agency.id,
      },
    }),

    prisma.client.create({
      data: {
        name: 'Casa 88',
        email: 'eventos@casa88.test',
        phone: '+5511988110003',
        organizationId: agency.id,
      },
    }),
  ]);

  await prisma.event.createMany({
    data: [
      {
        title: 'Sunset Rooftop',
        eventDate: dateAt(7),
        startTime: '18:00',
        endTime: '23:00',
        setDuration: '2h',
        venueName: 'Sunset Club',
        address: 'Rua das Flores, 100',
        city: 'São Paulo',
        state: 'SP',
        status: EventStatus.CONFIRMED,
        fee: 3500,
        paymentDate: dateAt(3, 12),
        paymentMethod: PaymentMethod.PIX,
        hasContract: true,
        notes: 'Evento da Marina.',
        artistId: marina.id,
        clientId: sunset.id,
        organizationId: agency.id,
      },

      {
        title: 'Aurora Open Air',
        eventDate: dateAt(18),
        startTime: '20:00',
        endTime: '02:00',
        setDuration: '3h',
        venueName: 'Parque Aurora',
        address: 'Av. Central, 500',
        city: 'São Paulo',
        state: 'SP',
        status: EventStatus.NEGOTIATING,
        fee: 4800,
        paymentMethod: PaymentMethod.DEPOSIT,
        hasContract: false,
        notes: 'Evento da Marina.',
        artistId: marina.id,
        clientId: aurora.id,
        organizationId: agency.id,
      },

      {
        title: 'Casa 88 - Sexta',
        eventDate: dateAt(-12),
        startTime: '22:00',
        endTime: '04:00',
        setDuration: '3h',
        venueName: 'Casa 88',
        address: 'Rua Augusta, 88',
        city: 'São Paulo',
        state: 'SP',
        status: EventStatus.CONFIRMED,
        fee: 2800,
        paymentDate: dateAt(-4, 12),
        paymentMethod: PaymentMethod.CASH,
        hasContract: true,
        notes: 'Evento passado do Lucas.',
        artistId: lucas.id,
        clientId: casa.id,
        organizationId: agency.id,
      },

      {
        title: 'Festival Aurora - Main Stage',
        eventDate: dateAt(25),
        startTime: '21:30',
        endTime: '03:30',
        setDuration: '2h',
        venueName: 'Parque Aurora',
        address: 'Av. Central, 500',
        city: 'São Paulo',
        state: 'SP',
        status: EventStatus.CONFIRMED,
        fee: 6200,
        paymentDate: dateAt(20, 12),
        paymentMethod: PaymentMethod.INVOICE,
        hasContract: true,
        notes: 'Evento futuro do Lucas.',
        artistId: lucas.id,
        clientId: aurora.id,
        organizationId: agency.id,
      },

      {
        title: 'Sunset Club - Teste de Agenda',
        eventDate: dateAt(10),
        startTime: '19:00',
        endTime: '00:00',
        setDuration: '90min',
        venueName: 'Sunset Club',
        address: 'Rua das Flores, 100',
        city: 'São Paulo',
        state: 'SP',
        status: EventStatus.LOST,
        fee: 2200,
        paymentMethod: PaymentMethod.OTHER,
        hasContract: false,
        notes: 'Proposta perdida do Rafa.',
        artistId: rafa.id,
        clientId: sunset.id,
        organizationId: agency.id,
      },
    ],
  });

  await prisma.invite.create({
    data: {
      email: 'novoartista@rewindj.test',
      role: Role.ARTIST,
      token: `seed-${Date.now()}`,
      status: InviteStatus.PENDING,
      organizationId: agency.id,
      createdById: ceoUser.id,
      createdByArtistId: carla.id,
      expiresAt: dateAt(1),
    },
  });

  return {
    agency,
    ceoUser,
    adminUser,
    producerUser,
    marinaUser,
    lucasUser,
    rafaUser,
    carla,
    andre,
    paula,
    marina,
    lucas,
    rafa,
  };
}

async function createIndependentScenario(passwordHash: string) {
  const user = await prisma.user.create({
    data: {
      email: 'sol@rewindj.test',
      password: passwordHash,
    },
  });

  const artist = await prisma.artist.create({
    data: {
      name: 'Sofia Almeida',
      stageName: 'DJ Sol',
      phone: '+5521999000021',
      city: 'Rio de Janeiro',
      state: 'RJ',
      pixKey: 'sol@rewindj.test',
      role: Role.ARTIST,
      isIndependent: true,
      userId: user.id,
      organizationId: null,
    },
  });

  const [marinaDaBarra, wedding] = await prisma.$transaction([
    prisma.client.create({
      data: {
        name: 'Marina da Barra',
        email: 'agenda@marinadabarra.test',
        phone: '+5521988110021',
        artistId: artist.id,
        organizationId: null,
      },
    }),

    prisma.client.create({
      data: {
        name: 'Casamento Camila & João',
        email: 'camila@casamento.test',
        phone: '+5521988110022',
        artistId: artist.id,
        organizationId: null,
      },
    }),
  ]);

  await prisma.event.createMany({
    data: [
      {
        title: 'Brunch na Marina',
        eventDate: dateAt(5),
        startTime: '12:00',
        endTime: '17:00',
        setDuration: '4h',
        venueName: 'Marina da Barra',
        address: 'Av. Lúcio Costa, 1000',
        city: 'Rio de Janeiro',
        state: 'RJ',
        status: EventStatus.CONFIRMED,
        fee: 4100,
        paymentDate: dateAt(1, 12),
        paymentMethod: PaymentMethod.PIX,
        hasContract: true,
        notes: 'Evento independente confirmado.',
        artistId: artist.id,
        clientId: marinaDaBarra.id,
        organizationId: null,
      },

      {
        title: 'Casamento Camila & João',
        eventDate: dateAt(30),
        startTime: '19:00',
        endTime: '01:00',
        setDuration: '5h',
        venueName: 'Casa de Festas Alto da Boa Vista',
        address: 'Estrada do Alto, 200',
        city: 'Rio de Janeiro',
        state: 'RJ',
        status: EventStatus.NEGOTIATING,
        fee: 7500,
        paymentMethod: PaymentMethod.INSTALLMENTS,
        hasContract: false,
        notes: 'Proposta enviada; aguardando retorno.',
        artistId: artist.id,
        clientId: wedding.id,
        organizationId: null,
      },
    ],
  });

  return {
    user,
    artist,
  };
}

async function main() {
  await removeSeedData();

  const passwordHash = await bcrypt.hash(password, 10);

  const agency = await createAgencyScenario(passwordHash);
  const independent = await createIndependentScenario(passwordHash);

  console.log('Seed concluído.');
  console.log(`Senha de todas as contas: ${password}`);

  console.log('');
  console.log('=== AGÊNCIA ===');
  console.log('CEO: ceo@rewindj.test');
  console.log('Admin: admin@rewindj.test');
  console.log('Producer: producer@rewindj.test');
  console.log('Artista Marina: marina@rewindj.test');
  console.log('Artista Lucas: lucas@rewindj.test');
  console.log('Artista Rafa: rafa@rewindj.test');

  console.log('');
  console.log('=== ARTISTA INDEPENDENTE ===');
  console.log('Sofia: sol@rewindj.test');

  console.log('');
  console.log('=== INVITE ===');
  console.log('Email: novoartista@rewindj.test');

  console.log('');
  console.log(`Agency ID: ${agency.agency.id}`);
  console.log(`CEO Artist ID: ${agency.carla.id}`);
  console.log(`Independent Artist ID: ${independent.artist.id}`);
}

main()
  .catch((error: unknown) => {
    console.error('Falha ao executar seed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
