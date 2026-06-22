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
    const products = this.productRepository.findAll();
    const productIndex = products.findIndex(
      product => product.id === id
    );

    if (productIndex === -1)
      throw new NotFoundException("Product not found");

    const updatedProduct = {
      ...products[productIndex],
      ...dto
    };

    this.productRepository.save(updatedProduct);
    return updatedProduct;
  }
}
