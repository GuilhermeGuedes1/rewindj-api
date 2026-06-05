import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dtos/register.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(data: RegisterDto) {
    const userAlreadyExists = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (userAlreadyExists) {
      throw new ConflictException('User already exists');
    }

    const organizationAlreadyExists = await this.prisma.organization.findFirst({
      where: {
        OR: [
          { email: data.organizationEmail },
          { document: data.organizationDocument },
        ],
      },
    });

    if (organizationAlreadyExists) {
      throw new ConflictException('Organization already exists');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    await this.prisma.$transaction(async (tx) => {
      const organization = await tx.organization.create({
        data: {
          name: data.organizationName,
          email: data.organizationEmail,
          document: data.organizationDocument,
        },
      });

      await tx.user.create({
        data: {
          name: data.name,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          password: passwordHash,
          role: Role.CEO,
          organizationId: organization.id,
        },
      });
    });

    return {
      message: 'User registered successfully',
    };
  }

  async create(data: CreateUserDto) {
    const organization = await this.prisma.organization.findUnique({
      where: { id: data.organizationId },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    const userAlreadyExists = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { phone: data.phone }],
      },
    });

    if (userAlreadyExists) {
      throw new ConflictException('User already exists');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: passwordHash,
        role: data.role,
        organizationId: data.organizationId,
      },
    });

    return {
      id: user.id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      organizationId: user.organizationId,
    };
  }

  async getUsers(organizationId: string) {
    const users = await this.prisma.user.findMany({
      where: { organizationId },
      select: {
        id: true,
        name: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        organizationId: true,
      },
    });

    return users;
  }

  async login(data: LoginDto): Promise<{ access_token: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new UnauthorizedException('User or email invalids');
    }

    const passwordMatch = await bcrypt.compare(data.password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('User or email invalids');
    }

    const payload = {
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
    };

    return { access_token: await this.jwt.signAsync(payload) };
  }
}
