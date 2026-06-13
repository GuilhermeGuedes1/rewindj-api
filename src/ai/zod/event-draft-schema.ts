import { z } from 'zod';

export const EventDraftSchema = z.object({
  title: z.string().nullable(),
  eventDate: z.string().nullable(),
  startTime: z.string().nullable(),
  endTime: z.string().nullable(),
  venueName: z.string().nullable(),
  address: z.string().nullable(),
  city: z.string().nullable(),
  state: z.string().nullable(),
  fee: z.number().nullable(),
  notes: z.string().nullable(),
  artistName: z.string().nullable(),
  clientName: z.string().nullable(),
  clientPhone: z.string().nullable(),
  clientEmail: z.string().nullable(),
});

export type EventDraft = z.infer<typeof EventDraftSchema>;
