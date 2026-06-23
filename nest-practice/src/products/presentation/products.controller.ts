import {
  Controller, Delete, Get, Param, Post, Put, Body, HttpStatus, HttpCode, ParseIntPipe, UseGuards,
  Query,
  Patch
} from '@nestjs/common';
import { FindAllProductsUseCase } from '../application/use-cases/find-all-products.use-case';
import { FindOneProductUseCase } from '../application/use-cases/find-one-product.use-case';
import { CreateProductUseCase } from '../application/use-cases/create-product.use-case';
import { ReplaceProductUseCase } from '../application/use-cases/replace-product.use-case';
import { UpdateProductUseCase } from '../application/use-cases/update-product.use-case';
import { RemoveProductUseCase } from '../application/use-cases/remove-product.use-case';
import { CreateProductDto } from './create-product.dto';
import { ReplaceProductDto } from './replace-product.dto';
import { UpdateProductDto } from './update-product.dto';
import { ApiKeyGuard } from '../../app.guard';



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

  // TODO: review — this handler's params were originally bare
  // `@Query() categoryId: number` etc. (each one binding the *entire*
  // query object, a pre-existing bug). I changed it to keyed
  // `@Query('name', ParseIntPipe)` params while verifying the endpoint
  // worked. Not something you wrote or asked for — a bug fix I made on
  // my own initiative during verification. Worth confirming you want it
  // fixed this way (vs. reverting and tracking it separately).
  // GET /products
  @Get()
  findAll(
    @Query('categoryId', new ParseIntPipe({ optional: true })) categoryId?: number,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('search') search?: string,
    @Query('minPrice', new ParseIntPipe({ optional: true })) minPrice?: number,
    @Query('maxPrice', new ParseIntPipe({ optional: true })) maxPrice?: number,
  ) {
    return this.findAllProductsUseCase.execute(categoryId, page, limit, search, minPrice, maxPrice);
  }

  // GET /products/:id
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
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
    @Param('id', ParseIntPipe) id: number,
    @Body() replaceProductDto: ReplaceProductDto,
  ) {
    return this.replaceProductUseCase.execute(id, replaceProductDto);
  }

  // PATCH /products/:id
  @Patch(':id')
  @UseGuards(ApiKeyGuard)
  updateExisting(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.updateProductUseCase.execute(id, updateProductDto);
  }

  // DELETE /products/:id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(ApiKeyGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.removeProductUseCase.execute(id);
  }
}
