import { Module } from '@nestjs/common';
import { CategoriesController } from './presentation/categories.controller';
import { CATEGORY_REPOSITORY } from './domain/category.repository';
import { InMemoryCategoryRepository } from './infrastructure/persistence/in-memory-category.repository';
import { FindAllCategoriesUseCase } from './application/use-cases/find-all-categories.use-case';
import { FindOneCategoryUseCase } from './application/use-cases/find-one-category.use-case';
import { CreateCategoryUseCase } from './application/use-cases/create-category.use-case';
import { UpdateCategoryUseCase } from './application/use-cases/update-category.use-case';
import { RemoveCategoryUseCase } from './application/use-cases/remove-category.use-case';

@Module({
  controllers: [CategoriesController],
  providers: [
    { provide: CATEGORY_REPOSITORY, useClass: InMemoryCategoryRepository },
    FindAllCategoriesUseCase,
    FindOneCategoryUseCase,
    CreateCategoryUseCase,
    UpdateCategoryUseCase,
    RemoveCategoryUseCase,
  ],
  // TODO: review — exporting CATEGORY_REPOSITORY makes this module's
  // persistence port part of its public surface, solely so
  // ProductsModule can inject it for CreateProductUseCase's "category
  // exists" check. New, not a mirror of anything products did.
  exports: [CATEGORY_REPOSITORY],
})
export class CategoriesModule {}
