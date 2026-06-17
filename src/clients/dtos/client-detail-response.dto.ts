import { ApiProperty } from '@nestjs/swagger';

class ClientEventResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  eventDate: Date;

  @ApiProperty()
  venueName: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  state: string;

  @ApiProperty()
  artistName: string;

  constructor(event: any) {
    this.id = event.id;
    this.title = event.title;
    this.eventDate = event.eventDate;
    this.venueName = event.venueName;
    this.city = event.city;
    this.state = event.state;

    this.artistName =
      event.artist?.stageName && event.artist.stageName !== 'string'
        ? event.artist.stageName
        : event.artist?.fullName;
  }
}

export class ClientDetailsResponseDto {
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

  @ApiProperty({
    type: ClientEventResponseDto,
    isArray: true,
  })
  events: ClientEventResponseDto[];

  constructor(client: any) {
    this.id = client.id;
    this.name = client.name;
    this.companyName = client.companyName;
    this.phone = client.phone;
    this.email = client.email;
    this.createdAt = client.createdAt;

    this.events =
      client.events?.map((event) => new ClientEventResponseDto(event)) ?? [];
  }
}
