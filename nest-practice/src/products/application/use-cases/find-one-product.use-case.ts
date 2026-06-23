import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from '../../domain/product.repository';
import type { ProductRepository } from '../../domain/product.repository';
import { CATEGORY_REPOSITORY } from '../../../categories/domain/category.repository';
import type { CategoryRepository } from '../../../categories/domain/category.repository';
import { ProductReturnDto } from '../dto/product-return.dto';

@Injectable()
export class FindOneProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY) private readonly productRepository: ProductRepository,
    @Inject(CATEGORY_REPOSITORY) private readonly categoryRepository: CategoryRepository,
  ) {}

  execute(id: number): ProductReturnDto {
    const product = this.productRepository.findOne(id);
    
    if (!product)
      throw new NotFoundException("Product not found");

    const correspondingCategory = this.categoryRepository.findOne(product.categoryId);

    if (!correspondingCategory)
      throw new NotFoundException("Category for product not found");

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      category: correspondingCategory,
    };
  }
}
