import { ApiProperty } from '@nestjs/swagger';

export class ClientResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ nullable: true })
  companyName: string | null;

  @ApiProperty()
  phone: string;

  @ApiProperty({ nullable: true })
  email: string | null;

  @ApiProperty()
  createdAt: Date;

  constructor(client: any) {
    this.id = client.id;
    this.name = client.name;
    this.companyName = client.companyName;
    this.phone = client.phone;
    this.email = client.email;
    this.createdAt = client.createdAt;
  }
}
