import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from '../../domain/product.repository';
import type { ProductRepository } from '../../domain/product.repository';
import { Product } from '../../domain/product.entity';

@Injectable()
export class RemoveProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY) private readonly productRepository: ProductRepository,
  ) {}

  execute(id: number): Product {
    const products = this.productRepository.findAll();
    const productIndex = products.findIndex(
      product => product.id === id
    );

    if (productIndex === -1)
      throw new NotFoundException("Product not found");
    
    const removedProduct = products.splice(productIndex, 1);
    this.productRepository.remove(removedProduct[0].id);
    return removedProduct[0];
  }
}
