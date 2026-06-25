import { z } from "zod";

export const CreateCategorySchema = z.object({
  name: z.string()
    .min(1, { message: "Name must be at least 1 character long" })
    .max(255, { message: "Name must be at most 255 characters long" })
});

export type CreateCategoryDto = z.infer<typeof CreateCategorySchema>;
