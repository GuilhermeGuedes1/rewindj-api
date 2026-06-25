import { BadRequestException, Injectable } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { EventDraftSchema } from './zod/event-draft-schema';
import { GenerateEventDraftMode } from './dtos/generate-event-draft.dto';

@Injectable()
export class AiService {
  private readonly ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  private buildSharedEventRules() {
    return `
    Regras de interpretação:
    - O texto pode ser uma conversa real de WhatsApp, com mensagens quebradas, respostas curtas e informações espalhadas.
    - Mesmo que o usuário não escreva de forma organizada, extraia qualquer informação relevante para o evento.
    - Datas relativas como "próximo sábado", "próximo domingo", "quarta que vem" devem ser calculadas com base na data atual informada no prompt.
    - Se houver local aproximado, ponto de referência ou bairro, use em address ou notes.
    - Se houver horário de início do evento e horário do set, diferencie:
      - horário geral do evento vai em notes
      - horário do set vai em startTime/endTime
    - Se houver duração do set, preencha setDuration.
    - Perguntas importantes do cliente devem ir em notes.
    - eventDate deve estar no formato YYYY-MM-DD.
    - paymentDate deve estar no formato YYYY-MM-DD.
    - startTime e endTime devem estar no formato HH:mm.
    `;
  }

  private buildCreateEventDraftPrompt(text: string) {
    return `
    Você é uma IA do sistema RewindJ, um SaaS para DJs, artistas e agências.

    Extraia do texto abaixo os dados de um evento.

    Modo: CREATE

    ${this.buildSharedEventRules()}

    Regras:
    - Tente preencher todos os campos possíveis com base no texto.
    - Quando uma informação não existir, retorne null.
    - Não invente dados.
    - Responda APENAS JSON válido.
    - eventDate deve estar no formato YYYY-MM-DD.
    - paymentDate deve estar no formato YYYY-MM-DD.
    - paymentMethod deve ser um dos valores:
      PIX,
      CASH,
      DEPOSIT,
      FULL_ON_EVENT,
      INVOICE,
      INSTALLMENTS,
      OTHER.
    - hasContract deve ser true ou false.
    - startTime representa o horário de início do set do artista/DJ.
    - endTime representa o horário final do set do artista/DJ.
    - Se o texto informar o horário de início do set e a duração, calcule o endTime.
    - Se o texto informar somente a duração, mas não informar o horário de início do set, retorne startTime null e endTime null.
    - Se o texto informar somente horário geral do evento, mas não deixar claro o horário do set, retorne startTime null e endTime null e coloque o horário geral em notes.

    Data atual para cálculo de datas relativas:
    ${new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })}

    Texto:
    ${text}

    Formato esperado:
    {
      "title": string | null,
      "eventDate": string | null,
      "startTime": string | null,
      "endTime": string | null,
      "setDuration": string | null,
      "venueName": string | null,
      "address": string | null,
      "city": string | null,
      "state": string | null,
      "fee": number | null,
      "paymentDate": string | null,
      "paymentMethod": string | null,
      "hasContract": boolean | null,
      "status": "NEGOTIATING" | "CONFIRMED" | "LOST" | null,
      "notes": string | null,
      "artistName": string | null,
      "clientName": string | null,
      "clientPhone": string | null,
      "clientEmail": string | null,
      "clientCompanyName": string | null
    }
    `;
  }
  private buildEditEventDraftPrompt(text: string) {
    return `
    Você é uma IA do sistema RewindJ, um SaaS para DJs, artistas e agências.

    Você está ajudando a editar um evento existente.

    Modo: EDIT

    ${this.buildSharedEventRules()}

    Extraia APENAS as informações novas ou alteradas presentes no texto.

    Regras obrigatórias:
    - Não invente dados.
    - Não retorne campos que não foram mencionados no texto.
    - Não retorne null.
    - Não retorne string vazia.
    - Não tente completar o evento inteiro.
    - O retorno deve conter somente os campos que devem ser atualizados.
    - Responda APENAS JSON válido.
    - eventDate deve estar no formato YYYY-MM-DD.
    - paymentDate deve estar no formato YYYY-MM-DD.
    - paymentMethod deve ser um dos valores:
      PIX,
      CASH,
      DEPOSIT,
      FULL_ON_EVENT,
      INVOICE,
      INSTALLMENTS,
      OTHER.
    - hasContract deve ser true ou false.
    - startTime representa o horário de início do set do artista/DJ.
    - endTime representa o horário final do set do artista/DJ.
    - Se o texto informar o horário de início do set e a duração, calcule o endTime.
    - Se o texto informar somente a duração, mas não informar o horário de início do set, retorne apenas setDuration.
    - Se o texto informar somente horário geral do evento, mas não deixar claro o horário do set, coloque essa informação em notes.

    Campos permitidos:
    {
      "title": string,
      "eventDate": string,
      "startTime": string,
      "endTime": string,
      "setDuration": string,
      "venueName": string,
      "address": string,
      "city": string,
      "state": string,
      "fee": number,
      "paymentDate": string,
      "paymentMethod": string,
      "hasContract": boolean,
      "status": "NEGOTIATING" | "CONFIRMED" | "LOST",
      "notes": string,
      "artistName": string,
      "clientName": string,
      "clientPhone": string,
      "clientEmail": string,
      "clientCompanyName": string
    }

    Data atual para cálculo de datas relativas:
    ${new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
    
    Texto:
    ${text}

    Exemplo de resposta correta no modo EDIT:
    {
      "fee": 1200,
      "status": "CONFIRMED",
      "startTime": "23:00"
    }

    Exemplo de resposta ERRADA no modo EDIT:
    {
      "title": null,
      "venueName": "",
      "fee": 1200
    }
    `;
  }

  async generateEventDraft(mode: GenerateEventDraftMode, text: string) {
    const prompt =
      mode === GenerateEventDraftMode.EDIT
        ? this.buildEditEventDraftPrompt(text)
        : this.buildCreateEventDraftPrompt(text);
    const response = await this.ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      contents: prompt,
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
