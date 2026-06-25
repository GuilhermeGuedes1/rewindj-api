import { z } from 'zod';

export const EventDraftSchema = z.object({
  title: z.string().nullable().optional(),

  eventDate: z.string().nullable().optional(),

  startTime: z.string().nullable().optional(),
  endTime: z.string().nullable().optional(),

  setDuration: z.string().nullable().optional(),

  status: z.enum(['NEGOTIATING', 'CONFIRMED', 'LOST']).nullable().optional(),

  venueName: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  state: z.string().nullable().optional(),

  fee: z.number().nullable().optional(),
  paymentDate: z.string().nullable().optional(),
  paymentMethod: z.string().nullable().optional(),

  hasContract: z.boolean().nullable().optional(),

  notes: z.string().nullable().optional(),

  artistName: z.string().nullable().optional(),

  clientName: z.string().nullable().optional(),
  clientPhone: z.string().nullable().optional(),
  clientEmail: z.string().nullable().optional(),
  clientCompanyName: z.string().nullable().optional(),
});

export type EventDraft = z.infer<typeof EventDraftSchema>;
