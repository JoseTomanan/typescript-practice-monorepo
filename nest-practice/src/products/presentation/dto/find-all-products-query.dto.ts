import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const FindAllProductsQuerySchema = z.object({
  categoryId: z.coerce.number().int().optional(),
  page: z.coerce.number().int().optional(),
  limit: z.coerce.number().int().optional(),
  search: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
});

export class FindAllProductsQueryDto extends createZodDto(FindAllProductsQuerySchema) {}
