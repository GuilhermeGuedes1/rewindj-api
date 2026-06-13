import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { GenerateEventDraftDto } from './dtos/generate-event-draft.dto';
import { AuthGuard } from 'src/auth/auth.guards';

@ApiTags('AI')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('event-draft')
  generateEventDraft(@Body() dto: GenerateEventDraftDto) {
    return this.aiService.generateEventDraft(dto.text);
  }
}
