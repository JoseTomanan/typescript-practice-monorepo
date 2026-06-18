import { Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  // GET /products
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  // GET /products/:id
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.productsService.findOne(id);
  }

  // POST /products
  @Post()
  create() {
    // Logic to create a product
  }

  // PUT /products/:id
  @Put(':id')
  update(@Param('id') id: number) {
    // Logic to update a product
  }

  // DELETE /products/:id
  @Delete(':id')
  remove() {
    // Logic to delete a product
  }
}
