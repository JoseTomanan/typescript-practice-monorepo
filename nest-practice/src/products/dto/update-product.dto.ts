import { IsInt, IsNumber, IsString } from "class-validator";

export class UpdateProductDto {
  @IsInt()
  id!: number;

  @IsString()
  name?: string;

  @IsNumber()
  price?: number;
  
  @IsInt()
  stock?: number;

  @IsInt()
  categoryId?: number;
}