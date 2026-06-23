import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsModule } from '../products.module';

// TODO: review — imports the whole ProductsModule rather than listing
// the use cases + repository tokens as providers directly. Simpler, and
// it exercises the real DI wiring (including ProductsModule ->
// CategoriesModule), but it's a different testing strategy than the
// plan called for, decided on my own.
describe('ProductsController', () => {
  let controller: ProductsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ProductsModule],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
