import { BadRequestException, Inject, Injectable } from '@nestjs/common';
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
    search?: string,
    minPrice?: number,
    maxPrice?: number,
  ): PaginationQueryResult<Product> {
    if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice)
      throw new BadRequestException('minPrice must not be greater than maxPrice');

    const products = this.productRepository.findAll();
    const decasedSearch: string | null = search ? search.toLowerCase() : null;

    // Apply filter
    let filteredProducts: Product[] = categoryId
      ? products.filter(product => product.categoryId === categoryId)
      : [...products];

    if (decasedSearch)
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(decasedSearch)
      );

    // Filter accdg to min price, max price
    if (minPrice !== undefined)
      filteredProducts = filteredProducts.filter(product => product.price >= minPrice);

    if (maxPrice !== undefined)
      filteredProducts = filteredProducts.filter(product => product.price <= maxPrice);

    // Pagination
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
