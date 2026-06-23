import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CATEGORY_REPOSITORY } from '../../domain/category.repository';
import type { CategoryRepository } from '../../domain/category.repository';
import { Category } from '../../domain/category.entity';

@Injectable()
export class UpdateCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY) private readonly categoryRepository: CategoryRepository,
  ) {}

  execute(id: number, name: string): Category {
    const category = this.categoryRepository.findOne(id);

    if (!category)
      throw new NotFoundException("Category not found");

    const updatedCategory: Category = { ...category, name };
    this.categoryRepository.save(updatedCategory);
    return updatedCategory;
  }
}
