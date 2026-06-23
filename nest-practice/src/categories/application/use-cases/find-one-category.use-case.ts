import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CATEGORY_REPOSITORY } from '../../domain/category.repository';
import type { CategoryRepository } from '../../domain/category.repository';
import { Category } from '../../domain/category.entity';

@Injectable()
export class FindOneCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY) private readonly categoryRepository: CategoryRepository,
  ) {}

  execute(id: number): Category {
    const category = this.categoryRepository.findOne(id);

    if (!category)
      throw new NotFoundException("Category not found");

    return category;
  }
}
