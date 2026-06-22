import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { Product } from './domain/product.entity';
import { CreateProductDto } from './presentation/create-product.dto';
import { UpdateProductDto } from './presentation/update-product.dto';
import { PaginationQueryResult } from './presentation/pagination-query.dto';
import { ReplaceProductDto } from './presentation/replace-product.dto';



@Injectable()
export class ProductsService {
  
  
  /**
   * For GET /products
   */
  findAll(
    categoryId?: number,
    page?: number,
    limit?: number,
    search?: string,
  ): PaginationQueryResult<Product> {
    
  }

  /**
   * For GET /products/:id
   */
  findOne(id: number): Product {
    
  }

  /**
   * For POST /products
   */
  create(product: CreateProductDto): Product {
    
  }

  /**
   * For PUT /products/:id
   */
  replace(id: number, newProduct: ReplaceProductDto): Product {
    
  }
  
  // PATCH /products/:id
  update(id: number, updatedProduct: UpdateProductDto): Product {
    
  }

  /**
   * For DELETE /products/:id
   */
  remove(id: number): Product {
    
  }
}
