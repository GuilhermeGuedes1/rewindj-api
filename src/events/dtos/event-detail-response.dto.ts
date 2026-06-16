import { ApiProperty } from '@nestjs/swagger';

class EventClientResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  email: string | null;

  constructor(client: any) {
    this.id = client.id;
    this.name = client.name;
    this.phone = client.phone;
    this.email = client.email;
  }
}

class EventArtistResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  stageName: string | null;

  @ApiProperty()
  email: string;

  constructor(artist: any) {
    this.id = artist.id;
    this.fullName = artist.fullName;
    this.stageName = artist.stageName;
    this.email = artist.email;
  }
}

export class EventDetailsResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  eventDate: Date;

  @ApiProperty()
  startTime: string;

  @ApiProperty()
  endTime: string;

  @ApiProperty()
  venueName: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  state: string;

  @ApiProperty()
  notes: string | null;

  @ApiProperty({ type: EventClientResponseDto })
  client: EventClientResponseDto;

  @ApiProperty({ type: EventArtistResponseDto })
  artist: EventArtistResponseDto;

  constructor(event: any) {
    this.id = event.id;
    this.title = event.title;
    this.eventDate = event.eventDate;
    this.startTime = event.startTime;
    this.endTime = event.endTime;
    this.venueName = event.venueName;
    this.address = event.address;
    this.city = event.city;
    this.state = event.state;
    this.notes = event.notes;

    this.client = new EventClientResponseDto(event.client);
    this.artist = new EventArtistResponseDto(event.artist);
  }
}
