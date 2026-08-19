import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import {
  AccountType,
  EventStatus,
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
const independentDocument = 'SEED-INDEPENDENT-0001';
const password = 'RewindJ@123';

function dateAt(daysFromToday: number, hour = 20): Date {
  const date = new Date();
  date.setUTCHours(hour, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() + daysFromToday);
  return date;
}

async function removeSeedOrganization(document: string) {
  const organization = await prisma.organization.findUnique({
    where: { document },
    select: { id: true },
  });

  if (!organization) return;

  await prisma.$transaction([
    prisma.event.deleteMany({ where: { organizationId: organization.id } }),
    prisma.invite.deleteMany({ where: { organizationId: organization.id } }),
    prisma.client.deleteMany({ where: { organizationId: organization.id } }),
    prisma.artist.deleteMany({ where: { organizationId: organization.id } }),
    prisma.user.deleteMany({ where: { organizationId: organization.id } }),
    prisma.organization.delete({ where: { id: organization.id } }),
  ]);
}

async function createAgencyScenario(passwordHash: string) {
  const agency = await prisma.organization.create({
    data: {
      name: 'RewindJ Demo Agency',
      document: agencyDocument,
      email: 'agency@rewindj.test',
      accountType: AccountType.AGENCY,
    },
  });

  const [ceo, admin, producer, artistUserA, artistUserB, artistUserC] =
    await prisma.$transaction([
      prisma.user.create({
        data: {
          name: 'Carla CEO',
          email: 'ceo@rewindj.test',
          phone: '+5511999000001',
          password: passwordHash,
          role: Role.CEO,
          organizationId: agency.id,
        },
      }),
      prisma.user.create({
        data: {
          name: 'André Admin',
          email: 'admin@rewindj.test',
          phone: '+5511999000002',
          password: passwordHash,
          role: Role.ADMIN,
          organizationId: agency.id,
        },
      }),
      prisma.user.create({
        data: {
          name: 'Paula Producer',
          email: 'producer@rewindj.test',
          phone: '+5511999000003',
          password: passwordHash,
          role: Role.PRODUCER,
          organizationId: agency.id,
        },
      }),
      prisma.user.create({
        data: {
          name: 'Marina Costa',
          email: 'marina@rewindj.test',
          phone: '+5511999000011',
          password: passwordHash,
          role: Role.ARTIST,
          organizationId: agency.id,
        },
      }),
      prisma.user.create({
        data: {
          name: 'Lucas Mendes',
          email: 'lucas@rewindj.test',
          phone: '+5511999000012',
          password: passwordHash,
          role: Role.ARTIST,
          organizationId: agency.id,
        },
      }),
      prisma.user.create({
        data: {
          name: 'Rafa Nunes',
          email: 'rafa@rewindj.test',
          phone: '+5511999000013',
          password: passwordHash,
          role: Role.ARTIST,
          organizationId: agency.id,
        },
      }),
    ]);

  const [marina, lucas, rafa] = await prisma.$transaction([
    prisma.artist.create({
      data: {
        name: artistUserA.name,
        stageName: 'DJ Marina',
        email: artistUserA.email,
        phone: artistUserA.phone,
        city: 'São Paulo',
        state: 'SP',
        pixKey: 'marina@rewindj.test',
        userId: artistUserA.id,
        organizationId: agency.id,
      },
    }),
    prisma.artist.create({
      data: {
        name: artistUserB.name,
        stageName: 'DJ Lucas M',
        email: artistUserB.email,
        phone: artistUserB.phone,
        city: 'São Paulo',
        state: 'SP',
        pixKey: 'lucas@rewindj.test',
        userId: artistUserB.id,
        organizationId: agency.id,
      },
    }),
    prisma.artist.create({
      data: {
        name: artistUserC.name,
        stageName: 'DJ Rafa Nunes',
        email: artistUserC.email,
        phone: artistUserC.phone,
        city: 'Campinas',
        state: 'SP',
        pixKey: 'rafa@rewindj.test',
        userId: artistUserC.id,
        organizationId: agency.id,
      },
    }),
  ]);

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
        notes: 'Evento confirmado para validar dashboard e financeiro.',
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
        notes: 'Aguardando aprovação do contrato.',
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
        notes: 'Evento passado pago.',
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
        notes: 'Evento futuro do Lucas para validar isolamento entre artistas.',
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
        notes: 'Proposta perdida para testar status LOST.',
        artistId: rafa.id,
        clientId: sunset.id,
        organizationId: agency.id,
      },
    ],
  });

  return { agency, ceo, admin, producer, marina, lucas, rafa };
}

async function createIndependentScenario(passwordHash: string) {
  const organization = await prisma.organization.create({
    data: {
      name: 'DJ Sol Independente',
      document: independentDocument,
      email: 'sol@rewindj.test',
      accountType: AccountType.INDEPENDENT_ARTIST,
    },
  });

  const user = await prisma.user.create({
    data: {
      name: 'Sofia Almeida',
      email: 'sol@rewindj.test',
      phone: '+5521999000021',
      password: passwordHash,
      role: Role.ARTIST,
      organizationId: organization.id,
    },
  });

  const artist = await prisma.artist.create({
    data: {
      name: user.name,
      stageName: 'DJ Sol',
      email: user.email,
      phone: user.phone,
      city: 'Rio de Janeiro',
      state: 'RJ',
      pixKey: 'sol@rewindj.test',
      userId: user.id,
      organizationId: organization.id,
    },
  });

  const [marinaDaBarra, wedding] = await prisma.$transaction([
    prisma.client.create({
      data: {
        name: 'Marina da Barra',
        email: 'agenda@marinadabarra.test',
        phone: '+5521988110021',
        organizationId: organization.id,
      },
    }),
    prisma.client.create({
      data: {
        name: 'Casamento Camila & João',
        email: 'camila@casamento.test',
        phone: '+5521988110022',
        organizationId: organization.id,
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
        organizationId: organization.id,
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
        organizationId: organization.id,
      },
    ],
  });

  return { organization, user, artist };
}

async function main() {
  await removeSeedOrganization(agencyDocument);
  await removeSeedOrganization(independentDocument);

  const passwordHash = await bcrypt.hash(password, 10);
  const agency = await createAgencyScenario(passwordHash);
  const independent = await createIndependentScenario(passwordHash);

  console.log('Seed concluído.');
  console.log(`Senha de todas as contas: ${password}`);
  console.log(`Agência: ${agency.agency.name}`);
  console.log(
    'Contas: ceo@rewindj.test, admin@rewindj.test, producer@rewindj.test',
  );
  console.log(
    'Artistas da agência: marina@rewindj.test, lucas@rewindj.test, rafa@rewindj.test',
  );
  console.log(`Artista independente: ${independent.user.email}`);
}

main()
  .catch((error: unknown) => {
    console.error('Falha ao executar seed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
