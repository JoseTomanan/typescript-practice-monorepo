export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsInt()
  stock: number;

  @IsInt()
  categoryId: number;
}
