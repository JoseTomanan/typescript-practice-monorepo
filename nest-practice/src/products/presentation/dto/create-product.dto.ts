import { IsString, IsNumber, IsInt, Min, IsPositive, MinLength } from 'class-validator';
// TODO: replace class-validator with Zod

export class CreateProductDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsNumber()
  @IsPositive()
  price!: number;

  @IsInt()
  @Min(0)
  stock!: number;

  @IsInt()
  categoryId!: number;
}
