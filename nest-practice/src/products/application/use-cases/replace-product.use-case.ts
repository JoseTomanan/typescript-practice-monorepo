import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from '../../domain/product.repository';
import type { ProductRepository } from '../../domain/product.repository';
import { Product } from '../../domain/product.entity';
import { ReplaceProductInput } from '../dto/product-inputs';

@Injectable()
export class ReplaceProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY) private readonly productRepository: ProductRepository,
  ) {}

  execute(id: number, dto: ReplaceProductInput): Product {
    const existing = this.productRepository.findOne(id);
    if (!existing)
      throw new NotFoundException('Product not found');

    const replacedProduct: Product = { id, ...dto };

    this.productRepository.save(replacedProduct);
    return replacedProduct;
  }
}
