import { z } from 'zod';

export const userSchema = z.object({
  userRole: z.enum(['USER', 'ADMIN']),
  email: z.string()
    .email(),
  userId: z.string()
    .optional(),
  firstName: z.string()
    .optional(),
  lastName: z.string()
    .optional(),
  data: z
    .object({
      country: z.string().optional(),
      birthdate: z.string().optional(),
    })
    .default({}),
});

export type User = z.infer<typeof userSchema>;
