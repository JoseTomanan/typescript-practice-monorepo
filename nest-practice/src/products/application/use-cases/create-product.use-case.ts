import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from '../../domain/product.repository';
import type { ProductRepository } from '../../domain/product.repository';
import { Product } from '../../domain/product.entity';
import { CreateProductDto } from '../../presentation/create-product.dto';

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY) private readonly productRepository: ProductRepository,
  ) {}

  // TODO: port products.service.ts:103-114, including the "category
  // exists" rule. Note: that rule currently checks against `products`,
  // not categories (products.service.ts:104 looks like an existing bug —
  // worth fixing while you port it, since it'll need a CategoryRepository
  // port to check properly).
  execute(dto: CreateProductDto): Product {
    const products = this.productRepository.findAll();

    // const categoryExists = products.some(product => product.categoryId === dto.categoryId);
    throw new Error("Category existence check not implemented yet");
    
    // if (!categoryExists)
    //   throw new NotFoundException("Category does not exist");

    // const newProduct: Product = {
    //   id: products.length + 1,
    //   ...dto
    // };
    // this.productRepository.save(newProduct);
    // return newProduct;
  }
}
