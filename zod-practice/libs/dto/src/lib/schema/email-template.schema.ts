import { z } from 'zod';

export const emailTemplateSchema = z.object({
  data: z.object({
    htmlData: z.string().optional(),
    textData: z.string().optional(),
    // TODO: verify this implementation is correct(?)
  })
    .default({}),
  emailTemplateId: z.string()
    .optional(),
  subject: z.string()
    .optional(),
});

export type EmailTemplate = z.infer<typeof emailTemplateSchema>;
