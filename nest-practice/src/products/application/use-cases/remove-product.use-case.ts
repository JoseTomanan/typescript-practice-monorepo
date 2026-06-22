import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from '../../domain/product.repository';
import type { ProductRepository } from '../../domain/product.repository';
import { Product } from '../../domain/product.entity';

@Injectable()
export class RemoveProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY) private readonly productRepository: ProductRepository,
  ) {}

  // TODO: review — rewritten from the version you wrote (which fetched
  // findAll(), spliced locally to find the NotFoundException case, then
  // separately called repository.remove()). This collapses both steps
  // into one repository.remove() call. Functionally equivalent, but it's
  // my rewrite, not a port of your code — check you're OK with it.
  execute(id: number): Product {
    const removedProduct = this.productRepository.remove(id);

    if (!removedProduct)
      throw new NotFoundException("Product not found");

    return removedProduct;
  }
}
