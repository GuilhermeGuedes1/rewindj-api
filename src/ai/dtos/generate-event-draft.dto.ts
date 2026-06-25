import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, MinLength } from 'class-validator';

export enum GenerateEventDraftMode {
  CREATE = 'create',
  EDIT = 'edit',
}

export class GenerateEventDraftDto {
  @ApiProperty({
    example: 'create',
    enum: GenerateEventDraftMode,
    description:
      'Defines whether the AI should generate a full draft or a partial edit draft.',
  })
  @IsEnum(GenerateEventDraftMode)
  mode!: GenerateEventDraftMode;

  @ApiProperty({
    example:
      'Oi, queria um DJ para casamento dia 20/07/2026 em Sao Paulo, das 20h as 02h, pagamento via PIX.',
    description:
      'Natural language request from a client or team member. The AI extracts structured event fields from this text.',
    minLength: 10,
  })
  @IsString()
  @MinLength(10)
  text!: string;
}
