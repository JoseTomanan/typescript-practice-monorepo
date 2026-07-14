import {
  Controller, Delete, Get, Param, Post, Put, Body, HttpStatus, HttpCode, UseGuards,
  Query,
  Patch
} from '@nestjs/common';
import { FindAllProductsUseCase } from '../application/use-cases/find-all-products.use-case';
import { FindOneProductUseCase } from '../application/use-cases/find-one-product.use-case';
import { CreateProductUseCase } from '../application/use-cases/create-product.use-case';
import { ReplaceProductUseCase } from '../application/use-cases/replace-product.use-case';
import { UpdateProductUseCase } from '../application/use-cases/update-product.use-case';
import { RemoveProductUseCase } from '../application/use-cases/remove-product.use-case';
import { CreateProductDto } from './dto/create-product.dto';
import { ReplaceProductDto } from './dto/replace-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FindAllProductsQueryDto } from './dto/find-all-products-query.dto';
import { ApiKeyGuard } from '../../app.guard';
import { IdParamDto } from '../../app.params.dto';

@Controller('products')
export class ProductsController {
  constructor(
    private findAllProductsUseCase: FindAllProductsUseCase,
    private findOneProductUseCase: FindOneProductUseCase,
    private createProductUseCase: CreateProductUseCase,
    private replaceProductUseCase: ReplaceProductUseCase,
    private updateProductUseCase: UpdateProductUseCase,
    private removeProductUseCase: RemoveProductUseCase,
  ) {}

  // GET /products
  @Get()
  findAll(
    @Query() { categoryId, page, limit, search, minPrice, maxPrice }: FindAllProductsQueryDto,
  ) {
    return this.findAllProductsUseCase.execute(categoryId, page, limit, search, minPrice, maxPrice);
  }

  // GET /products/:id
  @Get(':id')
  findOne(@Param() { id }: IdParamDto) {
    return this.findOneProductUseCase.execute(id);
  }

  // POST /products
  @Post()
  @UseGuards(ApiKeyGuard)
  create(@Body() createProductDto: CreateProductDto) {
    return this.createProductUseCase.execute(createProductDto);
  }

  // PUT /products/:id
  @Put(':id')
  @UseGuards(ApiKeyGuard)
  replace(
    @Param() { id }: IdParamDto,
    @Body() replaceProductDto: ReplaceProductDto,
  ) {
    return this.replaceProductUseCase.execute(id, replaceProductDto);
  }

  // PATCH /products/:id
  @Patch(':id')
  @UseGuards(ApiKeyGuard)
  updateExisting(
    @Param() { id }: IdParamDto,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.updateProductUseCase.execute(id, updateProductDto);
  }

  // DELETE /products/:id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(ApiKeyGuard)
  remove(@Param() { id }: IdParamDto) {
    return this.removeProductUseCase.execute(id);
  }
}
