import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from '../../domain/product.repository';
import type { ProductRepository } from '../../domain/product.repository';
import { Product } from '../../domain/product.entity';
import { CreateProductInput } from '../dto/product-inputs';
import { CATEGORY_REPOSITORY } from '../../../categories/domain/category.repository';
import type { CategoryRepository } from '../../../categories/domain/category.repository';
import { ProductReturnDto } from '../dto/product-return.dto';

// FIXME: review
@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY) private readonly productRepository: ProductRepository,
    @Inject(CATEGORY_REPOSITORY) private readonly categoryRepository: CategoryRepository,
  ) {}

  execute(input: CreateProductInput): ProductReturnDto {
    const correspondingCategory = this.categoryRepository.findOne(input.categoryId);
    if (!correspondingCategory)
      throw new NotFoundException("Category does not exist");

    const products = this.productRepository.findAll();
    const newProduct: Product = {
      id: Math.max(0, ...products.map(p => p.id)) + 1,
      ...input
    };

    this.productRepository.save(newProduct);
    return {
      id: newProduct.id,
      name: newProduct.name,
      price: newProduct.price,
      stock: newProduct.stock,
      category: correspondingCategory,
    };
  }
}
