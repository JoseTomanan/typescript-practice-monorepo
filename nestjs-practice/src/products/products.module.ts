import { Module } from '@nestjs/common';
import { CategoriesModule } from '../categories/categories.module';
import { ProductsController } from './presentation/products.controller';
import { PRODUCT_REPOSITORY } from './domain/product.repository';
import { InMemoryProductRepository } from './infrastructure/persistence/in-memory-product.repository';
import { FindAllProductsUseCase } from './application/use-cases/find-all-products.use-case';
import { FindOneProductUseCase } from './application/use-cases/find-one-product.use-case';
import { CreateProductUseCase } from './application/use-cases/create-product.use-case';
import { ReplaceProductUseCase } from './application/use-cases/replace-product.use-case';
import { UpdateProductUseCase } from './application/use-cases/update-product.use-case';
import { RemoveProductUseCase } from './application/use-cases/remove-product.use-case';

// TODO: review — ProductsModule importing CategoriesModule is new
// module-level coupling, added so CreateProductUseCase could inject
// CATEGORY_REPOSITORY. See create-product.use-case.ts for the matching
// TODO.
@Module({
  imports: [CategoriesModule],
  controllers: [ProductsController],
  providers: [
    { provide: PRODUCT_REPOSITORY, useClass: InMemoryProductRepository },
    FindAllProductsUseCase,
    FindOneProductUseCase,
    CreateProductUseCase,
    ReplaceProductUseCase,
    UpdateProductUseCase,
    RemoveProductUseCase,
  ],
})
export class ProductsModule {}
