import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from '../../domain/product.repository';
import type { ProductRepository } from '../../domain/product.repository';
import { Product } from '../../domain/product.entity';
import { UpdateProductInput } from '../dto/product-inputs';

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY) private readonly productRepository: ProductRepository,
  ) {}

  execute(id: number, dto: UpdateProductInput): Product {
    const existing = this.productRepository.findOne(id);
    if (!existing)
      throw new NotFoundException('Product not found');

    // TODO: (if need) validate category ID exists (same w create product)

    const updatedProduct = {
      ...existing,
      ...dto
    };

    this.productRepository.save(updatedProduct);
    return updatedProduct;
  }
}
