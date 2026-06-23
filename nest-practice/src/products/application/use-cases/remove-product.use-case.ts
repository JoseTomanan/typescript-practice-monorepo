import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from '../../domain/product.repository';
import type { ProductRepository } from '../../domain/product.repository';
import { ProductReturnDto } from '../dto/product-return.dto';
import { CATEGORY_REPOSITORY } from '../../../categories/domain/category.repository';
import type { CategoryRepository } from '../../../categories/domain/category.repository';

@Injectable()
export class RemoveProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY) private readonly productRepository: ProductRepository,
    @Inject(CATEGORY_REPOSITORY) private readonly categoryRepository: CategoryRepository,
  ) {}

  execute(id: number): ProductReturnDto {
    const removedProduct = this.productRepository.remove(id);

    if (!removedProduct)
      throw new NotFoundException("Product not found");

    const correspondingCategory = this.categoryRepository.findOne(removedProduct.categoryId);

    if (!correspondingCategory)
      throw new NotFoundException("Category for product not found");

    return {
      id: removedProduct.id,
      name: removedProduct.name,
      price: removedProduct.price,
      stock: removedProduct.stock,
      category: correspondingCategory,
    };
  }
}
