import {
  Controller, Delete, Get, Param, Post, Put, Body, HttpStatus, HttpCode, ParseIntPipe, ValidationPipe, UseGuards
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiKeyGuard } from '../common/guards/api-key.guard';

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
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  // POST /products
  @Post()
  @UseGuards(ApiKeyGuard)
  create(@Body(new ValidationPipe) createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  // PUT /products/:id
  @Put(':id')
  @UseGuards(ApiKeyGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe) updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  // DELETE /products/:id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(ApiKeyGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
