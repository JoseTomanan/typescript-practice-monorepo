import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from '../../domain/product.repository';
import type { ProductRepository } from '../../domain/product.repository';
import { UpdateProductInput } from '../dto/product-inputs';
import { CATEGORY_REPOSITORY, type CategoryRepository } from '../../../categories/domain/category.repository';
import { ProductReturnDto } from '../dto/product-return.dto';

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY) private readonly productRepository: ProductRepository,
    @Inject(CATEGORY_REPOSITORY) private readonly categoryRepository: CategoryRepository,
  ) {}

  execute(id: number, dto: UpdateProductInput): ProductReturnDto {
    const existing = this.productRepository.findOne(id);
    if (!existing)
      throw new NotFoundException('Product not found');

    const correspondingCategory = dto.categoryId
          ? this.categoryRepository.findOne(dto.categoryId ?? existing.categoryId)
          : existing;

    if (!correspondingCategory)
      throw new NotFoundException("Category for product not found");

    const updatedProduct = {
      ...existing,
      ...dto,
      category: correspondingCategory,
    };

    this.productRepository.save(updatedProduct);
    return updatedProduct;
  }
}
