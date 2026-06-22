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

  execute(
    categoryId?: number,
    page?: number,
    limit?: number,
    search?: string
  ): PaginationQueryResult<Product> {
    const products = this.productRepository.findAll();
    const decasedSearch: string | null = search ? search.toLowerCase() : null;

    // Apply filters first — regardless of whether pagination was requested.
    let filteredProducts: Product[] = categoryId
      ? products.filter(product => product.categoryId === categoryId)
      : [...products];

    if (decasedSearch)
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(decasedSearch)
      );

    // Then paginate — return all filtered results when page/limit are absent.
    if (!page || !limit)
      return {
        data: filteredProducts,
        meta: {
          total: filteredProducts.length,
          page: 1,
          limit: filteredProducts.length,
          totalPages: 1,
        },
      };

    const startIndex: number = (page - 1) * limit;
    const endIndex: number = startIndex + limit;

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
