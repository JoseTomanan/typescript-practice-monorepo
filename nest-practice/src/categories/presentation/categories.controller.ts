import {
  Controller, Param, Get, Post, Put, Delete, Body, HttpStatus, HttpCode, UseGuards,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FindAllCategoriesUseCase } from '../application/use-cases/find-all-categories.use-case';
import { FindOneCategoryUseCase } from '../application/use-cases/find-one-category.use-case';
import { CreateCategoryUseCase } from '../application/use-cases/create-category.use-case';
import { UpdateCategoryUseCase } from '../application/use-cases/update-category.use-case';
import { RemoveCategoryUseCase } from '../application/use-cases/remove-category.use-case';
import { ApiKeyGuard } from '../../app.guard';
import { IdParamDto } from '../../app.params.dto';

@Controller('categories')
export class CategoriesController {
  constructor(
    private findAllCategoriesUseCase: FindAllCategoriesUseCase,
    private findOneCategoryUseCase: FindOneCategoryUseCase,
    private createCategoryUseCase: CreateCategoryUseCase,
    private updateCategoryUseCase: UpdateCategoryUseCase,
    private removeCategoryUseCase: RemoveCategoryUseCase,
  ) {}

  // GET /categories
  @Get()
  findAll() {
    return this.findAllCategoriesUseCase.execute();
  }

  // GET /categories/:id
  // TODO: review — previously `@Param('id', ParseIntPipe) id: number`. The
  // global ZodValidationPipe (see app.pipe.ts) now has
  // `strictSchemaDeclaration: true`, which throws on any param whose type
  // isn't a `createZodDto` class — `number` doesn't qualify, so this had to
  // move to `{ id }: IdParamDto` (shared across products + categories, see
  // app.params.dto.ts), destructuring the validated/coerced id back out.
  @Get(':id')
  findOne(@Param() { id }: IdParamDto) {
    return this.findOneCategoryUseCase.execute(id);
  }

  // POST /categories
  @Post()
  @UseGuards(ApiKeyGuard)
  create(
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    return this.createCategoryUseCase.execute(createCategoryDto.name);
  }

  // PUT /categories/:id
  // TODO: review — see findOne above for why this is `{ id }: IdParamDto`
  // instead of `@Param('id', ParseIntPipe) id: number`.
  @Put(':id')
  @UseGuards(ApiKeyGuard)
  update(
    @Param() { id }: IdParamDto,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.updateCategoryUseCase.execute(id, updateCategoryDto.name);
  }

  // DELETE /categories/:id
  // TODO: review — see findOne above for why this is `{ id }: IdParamDto`
  // instead of `@Param('id', ParseIntPipe) id: number`.
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(ApiKeyGuard)
  remove(@Param() { id }: IdParamDto) {
    return this.removeCategoryUseCase.execute(id);
  }
}
