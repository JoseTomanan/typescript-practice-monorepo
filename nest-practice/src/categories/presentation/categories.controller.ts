import {
  Controller, Param, Get, Post, Put, Delete, Body, ParseIntPipe, HttpStatus, HttpCode, UseGuards,
} from '@nestjs/common';
import { CreateCategoryDto } from './create-category.dto';
import { UpdateCategoryDto } from './update-category.dto';
import { FindAllCategoriesUseCase } from '../application/use-cases/find-all-categories.use-case';
import { FindOneCategoryUseCase } from '../application/use-cases/find-one-category.use-case';
import { CreateCategoryUseCase } from '../application/use-cases/create-category.use-case';
import { UpdateCategoryUseCase } from '../application/use-cases/update-category.use-case';
import { RemoveCategoryUseCase } from '../application/use-cases/remove-category.use-case';
import { ApiKeyGuard } from '../../app.guard';



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
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.findOneCategoryUseCase.execute(id);
  }

  // POST /categories
  @Post()
  @UseGuards(ApiKeyGuard)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.createCategoryUseCase.execute(createCategoryDto.name);
  }

  // PUT /categories/:id
  @Put(':id')
  @UseGuards(ApiKeyGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.updateCategoryUseCase.execute(id, updateCategoryDto.name);
  }

  // DELETE /categories/:id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(ApiKeyGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.removeCategoryUseCase.execute(id);
  }
}
