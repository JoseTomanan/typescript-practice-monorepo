import { z } from "zod";

export const UpdateCategorySchema = z.object({
  name: z.string().min(1, { message: "Name must be at least 1 character long" }),
});

export type UpdateCategoryDto = z.infer<typeof UpdateCategorySchema>;