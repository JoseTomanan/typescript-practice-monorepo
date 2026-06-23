import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CATEGORY_REPOSITORY } from '../../domain/category.repository';
import type { CategoryRepository } from '../../domain/category.repository';
import { Category } from '../../domain/category.entity';

@Injectable()
export class RemoveCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY) private readonly categoryRepository: CategoryRepository,
  ) {}

  // TODO: Implement "cannot delete category with associated products" rule
  // use ProductRepository for this
  // ^^ realize that a circular dependency might happen; consider how to resolve it (e.g., using forwardRef in NestJS)
  execute(id: number): Category {
    const removedCategory = this.categoryRepository.remove(id);

    if (!removedCategory)
      throw new NotFoundException("Category not found");

    return removedCategory;
  }
}
