import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from '../../domain/product.repository';
import type { ProductRepository } from '../../domain/product.repository';
import { Product } from '../../domain/product.entity';
import { ReplaceProductDto } from '../../presentation/replace-product.dto';

@Injectable()
export class ReplaceProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY) private readonly productRepository: ProductRepository,
  ) {}

  execute(id: number, dto: ReplaceProductDto): Product {
    const products = this.productRepository.findAll();
    const productIndex = products.findIndex(
      product => product.id === id
    );

    if (productIndex === -1)
      throw new NotFoundException("Product not found");

    const replacedProduct = {
      ...products[productIndex],
      ...dto
    };

    this.productRepository.save(replacedProduct);
    return replacedProduct;
  }
}
