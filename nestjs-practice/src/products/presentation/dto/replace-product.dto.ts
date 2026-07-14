import { createZodDto } from "nestjs-zod";
import { CreateProductSchema } from "./create-product.dto";

export const ReplaceProductSchema = CreateProductSchema;

export class ReplaceProductDto extends createZodDto(ReplaceProductSchema) {}
