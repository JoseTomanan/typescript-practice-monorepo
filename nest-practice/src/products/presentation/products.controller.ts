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
import { type CreateProductDto, CreateProductSchema } from './dto/create-product.dto';
import { type ReplaceProductDto, ReplaceProductSchema } from './dto/replace-product.dto';
import { type UpdateProductDto, UpdateProductSchema } from './dto/update-product.dto';
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
  // TODO: review — previously `@Param('id', ParseIntPipe) id: number` (see
  // app.params.dto.ts for why this changed). `{ id }: IdParamDto` destructures
  // the single field straight out of the validated params object.
  @Get(':id')
  findOne(@Param() { id }: IdParamDto) {
    return this.findOneProductUseCase.execute(id);
  }

  // POST /products
  @Post()
  @UseGuards(ApiKeyGuard)
  create(
    @Body(new ZodValidationPipe(CreateProductSchema)) createProductDto: CreateProductDto,
  ) {
    return this.createProductUseCase.execute(createProductDto);
  }

  // PUT /products/:id
  // TODO: review — see findOne above for why this is `{ id }: IdParamDto`
  // instead of `@Param('id', ParseIntPipe) id: number`.
  @Put(':id')
  @UseGuards(ApiKeyGuard)
  replace(
    @Param() { id }: IdParamDto,
    @Body(new ZodValidationPipe(ReplaceProductSchema)) replaceProductDto: ReplaceProductDto,
  ) {
    return this.replaceProductUseCase.execute(id, replaceProductDto);
  }

  // PATCH /products/:id
  // TODO: review — see findOne above for why this is `{ id }: IdParamDto`
  // instead of `@Param('id', ParseIntPipe) id: number`.
  @Patch(':id')
  @UseGuards(ApiKeyGuard)
  updateExisting(
    @Param() { id }: IdParamDto,
    @Body(new ZodValidationPipe(UpdateProductSchema)) updateProductDto: UpdateProductDto,
  ) {
    return this.updateProductUseCase.execute(id, updateProductDto);
  }

  // DELETE /products/:id
  // TODO: review — see findOne above for why this is `{ id }: IdParamDto`
  // instead of `@Param('id', ParseIntPipe) id: number`.
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(ApiKeyGuard)
  remove(@Param() { id }: IdParamDto) {
    return this.removeProductUseCase.execute(id);
  }
}
