import { IsNumber, IsOptional, Min } from "class-validator";

export class PaginationQueryDto {
  @IsNumber()
  @IsOptional()
  @Min(1)
  page?: number;

  @IsNumber()
  @IsOptional()
  limit?: number;
}
