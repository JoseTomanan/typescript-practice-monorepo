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
    const products = this.productRepository.findAll();
    const productIndex = products.findIndex(
      product => product.id === id
    );

    if (productIndex === -1)
      throw new NotFoundException("Product not found");

    // PUT: full replacement — build from the DTO only (all fields required by
    // ReplaceProductInput), preserving only the id from the existing record.
    const replacedProduct: Product = { id, ...dto };

    this.productRepository.save(replacedProduct);
    return replacedProduct;
  }
}
