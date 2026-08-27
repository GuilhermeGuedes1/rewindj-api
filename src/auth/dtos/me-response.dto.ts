import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from 'src/generated/prisma/enums';

export class MeResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  email!: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiProperty()
  role!: Role;

  @ApiPropertyOptional()
  organizationId?: string;

  @ApiPropertyOptional()
  organizationName?: string;

  @ApiPropertyOptional()
  artistId?: string | null;

  @ApiPropertyOptional()
  profileImage?: string | null;

  @ApiProperty()
  isIndependent!: boolean;

  constructor(data: Partial<MeResponseDto>) {
    Object.assign(this, data);
  }
}
