import {
  Controller, Delete, Get, Param, Post, Put, Body, HttpStatus, HttpCode, ParseIntPipe, ValidationPipe, UseGuards,
  Query,
  Patch
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ReplaceProductDto } from './dto/replace-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiKeyGuard } from '../app.guard';



@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  // GET /products
  @Get()
  findAll(
    @Query() categoryId: number,
    @Query() page: number,
    @Query() limit: number,
    @Query() search: string,
  ) {
    return this.productsService.findAll(categoryId, page, limit, search);
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
  replace(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe) replaceProductDto: ReplaceProductDto,
  ) {
    return this.productsService.replace(id, replaceProductDto);
  }

  // PATCH /products/:id
  @Patch(':id')
  @UseGuards(ApiKeyGuard)
  updateExisting(
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
