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

export class PaginationQueryResult<T> {
  data!: T[];
  meta!: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}