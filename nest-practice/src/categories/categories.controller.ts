import {
  Controller, Param, Get, Post, Put, Delete, Body, ParseIntPipe, HttpStatus, HttpCode, ValidationPipe, UseGuards,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoriesService } from './categories.service';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiKeyGuard } from '../common/guards/api-key.guard';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  // GET /categories
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  // GET /categories/:id
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOne(id);
  }

  // POST /categories
  @Post()
  @UseGuards(ApiKeyGuard)
  create(@Body(new ValidationPipe) createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto.name);
  }

  // PUT /categories/:id
  @Put(':id')
  @UseGuards(ApiKeyGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe) updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto.name);
  }

  // DELETE /categories/:id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(ApiKeyGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.remove(id);
  }
}
