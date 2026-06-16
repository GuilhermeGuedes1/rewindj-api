import { ApiProperty } from '@nestjs/swagger';
import { createClientDto } from './create-client.dto';

export class CreateClientResponseDto {
  @ApiProperty({
    type: createClientDto,
    description:
      'Current client creation payload returned by the endpoint after validation.',
  })
  message!: createClientDto;
}
