import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AiService } from './ai.service';
import { GenerateEventDraftDto } from './dtos/generate-event-draft.dto';
import { AuthGuard } from 'src/auth/auth.guards';
import { EventDraftResponseDto } from './dtos/event-draft-response.dto';

@ApiTags('AI')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @ApiOperation({
    summary: 'Generate a structured event draft from free text',
    description:
      'Uses AI to extract event, client, artist, location, schedule, and payment fields from a natural language message. Missing information is returned as null.',
  })
  @ApiBody({ type: GenerateEventDraftDto })
  @ApiOkResponse({
    description: 'Structured event draft generated successfully.',
    type: EventDraftResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Prompt is invalid or the AI provider returned invalid JSON.',
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid bearer token.' })
  @Post('event-draft')
  generateEventDraft(@Body() dto: GenerateEventDraftDto) {
    return this.aiService.generateEventDraft(dto.text);
  }
}
