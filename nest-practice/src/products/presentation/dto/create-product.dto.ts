import { z } from "zod";

export const CreateProductSchema = z.object({
  name: z.string()
    .min(2, { message: "Name must be at least 2 characters long" }),
  price: z.number()
    .positive({ message: "Price must be a positive number" }),
  stock: z.number()
    .min(0, { message: "Stock must be a non-negative number" }),
  categoryId: z.number()
});

export type CreateProductDto = z.infer<typeof CreateProductSchema>;
