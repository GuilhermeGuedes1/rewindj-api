import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class GenerateEventDraftDto {
  @ApiProperty({
    example:
      'Oi, queria um DJ para casamento dia 20/07 em São Paulo, das 20h às 02h...',
  })
  @IsString()
  @MinLength(10)
  text!: string;
}
