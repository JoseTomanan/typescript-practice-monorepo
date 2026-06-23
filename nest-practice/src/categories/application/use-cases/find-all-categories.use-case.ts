import { Inject, Injectable } from '@nestjs/common';
import { CATEGORY_REPOSITORY } from '../../domain/category.repository';
import type { CategoryRepository } from '../../domain/category.repository';
import { Category } from '../../domain/category.entity';

@Injectable()
export class FindAllCategoriesUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY) private readonly categoryRepository: CategoryRepository,
  ) {}

  execute(): Category[] {
    return this.categoryRepository.findAll();
  }
}
