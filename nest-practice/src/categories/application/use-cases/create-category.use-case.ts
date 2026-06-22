import { Inject, Injectable } from '@nestjs/common';
import { CATEGORY_REPOSITORY } from '../../domain/category.repository';
import type { CategoryRepository } from '../../domain/category.repository';
import { Category } from '../../domain/category.entity';

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY) private readonly categoryRepository: CategoryRepository,
  ) {}

  execute(name: string): Category {
    const categories = this.categoryRepository.findAll();
    const newCategory: Category = {
      id: Math.max(0, ...categories.map(c => c.id)) + 1,
      name,
    };

    this.categoryRepository.save(newCategory);
    return newCategory;
  }
}
