import { Inject, Injectable } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from '../../domain/product.repository';
import type { ProductRepository } from '../../domain/product.repository';
import { PaginationQueryResult } from '../../application/dto/pagination-result.dto';
import { Product } from '../../domain/product.entity';

@Injectable()
export class FindAllProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY) private readonly productRepository: ProductRepository,
  ) {}

  // TODO: port the categoryId/page/limit/search filtering logic from
  // products.service.ts:46-87. This is the use case orchestrating plain
  // data from the repository — it should contain no NestJS HTTP types.
  execute(
    categoryId?: number,
    page?: number,
    limit?: number,
    search?: string
  ): PaginationQueryResult<Product> {
    const products = this.productRepository.findAll();

    const decasedSearch: string | null = search
          ? search.toLowerCase()
          : null;

    if (!page || !limit)
      return {
        data: products,
        meta: {
          total: products.length,
          page: 1,
          limit: products.length,
          totalPages: 1,
        },
      };

    const startIndex: number = (page - 1) * limit;
    const endIndex: number = startIndex + limit;
    let filteredProducts: Product[] = categoryId
          ? products.filter(product => product.categoryId === categoryId)
          : products;

    if (decasedSearch)
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(decasedSearch)
      );

    return {
      data: filteredProducts.slice(startIndex, endIndex),
      meta: {
        total: filteredProducts.length,
        page,
        limit,
        totalPages: Math.ceil(filteredProducts.length / limit),
      },
    };
  }
}
