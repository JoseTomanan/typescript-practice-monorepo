import { Category } from "../../../categories/domain/category.entity";

export class ProductReturnDto {
  id!: number;
  name!: string;
  price!: number;
  stock!: number;
  category!: Category;
}