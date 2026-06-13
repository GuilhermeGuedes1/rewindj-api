import { BadRequestException, Injectable } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { EventDraftSchema } from './zod/event-draft-schema';

@Injectable()
export class AiService {
  private readonly ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  async generateEventDraft(text: string) {
    const response = await this.ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      contents: `
Você é uma IA do sistema Orbit, um SaaS para DJs e agências.

Extraia do texto abaixo os dados de um evento.

Responda APENAS em JSON válido.

Texto:
${text}

Formato esperado:
{
  "title": string | null,
  "eventDate": string | null,
  "startTime": string | null,
  "endTime": string | null,
  "venueName": string | null,
  "address": string | null,
  "city": string | null,
  "state": string | null,
  "fee": number | null,
  "notes": string | null,
  "artistName": string | null,
  "clientName": string | null,
  "clientPhone": string | null,
  "clientEmail": string | null
}
      `,
    });

    const rawText = response.text;

    if (!rawText) {
      throw new BadRequestException('Gemini não retornou resposta.');
    }

    const cleanedResponse = rawText
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    try {
      const json: unknown = JSON.parse(cleanedResponse);

      const parsed = EventDraftSchema.parse(json);

      return parsed;
    } catch {
      throw new BadRequestException('Gemini retornou um JSON inválido.');
    }
  }
}
