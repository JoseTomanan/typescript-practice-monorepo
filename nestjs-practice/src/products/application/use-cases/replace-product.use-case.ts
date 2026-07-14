import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from '../../domain/product.repository';
import type { ProductRepository } from '../../domain/product.repository';
import { Product } from '../../domain/product.entity';
import { ReplaceProductInput } from '../dto/product-inputs';
import { ProductReturnDto } from '../dto/product-return.dto';
import { CATEGORY_REPOSITORY } from '../../../categories/domain/category.repository';
import type { CategoryRepository } from '../../../categories/domain/category.repository';

@Injectable()
export class ReplaceProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY) private readonly productRepository: ProductRepository,
    @Inject(CATEGORY_REPOSITORY) private readonly categoryRepository: CategoryRepository,
  ) {}

  execute(id: number, dto: ReplaceProductInput): ProductReturnDto {
    const existing = this.productRepository.findOne(id);
    if (!existing)
      throw new NotFoundException('Product not found');

    const replacedProduct: Product = { id, ...dto };

    const correspondingCategory = this.categoryRepository.findOne(replacedProduct.categoryId);
    if (!correspondingCategory)
      throw new NotFoundException("Category for product not found");

    this.productRepository.save(replacedProduct);

    return {
      id: replacedProduct.id,
      name: replacedProduct.name,
      price: replacedProduct.price,
      stock: replacedProduct.stock,
      category: correspondingCategory,
    };
  }
}
