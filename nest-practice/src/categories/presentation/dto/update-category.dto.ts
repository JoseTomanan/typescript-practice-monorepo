// TODO: review — see products/presentation/dto/create-product.dto.ts for
// the full explanation of why `type UpdateCategoryDto` became
// `class UpdateCategoryDto extends createZodDto(...)`.
import { z } from "zod";
import { createZodDto } from "nestjs-zod";

export const UpdateCategorySchema = z.object({
  name: z.string()
    .min(1, { message: "Name must be at least 1 character long" })
    .max(255, { message: "Name must be at most 255 characters long" }),
});

export class UpdateCategoryDto extends createZodDto(UpdateCategorySchema) {}
