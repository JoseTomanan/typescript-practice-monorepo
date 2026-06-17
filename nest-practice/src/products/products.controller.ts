import { Controller, Delete, Get, Post, Put } from '@nestjs/common';

@Controller('products')
export class ProductsController {
  // GET /products
  @Get()
  findAll() {
    return [{ name: 'Product 1' }, { name: 'Product 2' }];
  }

  // GET /products/:id
  @Get(':id')
  findOne() {
    return { name: 'Product 1' };
  }

  // POST /products
  @Post()
  create() {
    // Logic to create a product
  }

  // PUT /products/:id
  @Put(':id')
  update() {
    // Logic to update a product
  }

  // DELETE /products/:id
  @Delete(':id')
  remove() {
    // Logic to delete a product
  }
}
