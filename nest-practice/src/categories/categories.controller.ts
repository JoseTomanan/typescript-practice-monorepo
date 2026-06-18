import { Controller, Param, Get, Post, Put, Delete, Body, ParseIntPipe, HttpStatus, HttpCode, ValidationPipe, } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoriesService } from './categories.service';
import { UpdateCategoryDto } from './dto/update-category.dto';

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
  create(@Body(new ValidationPipe) createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto.name);
  }

  // PUT /categories/:id
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe) updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto.name);
  }

  // DELETE /categories/:id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.remove(id);
  }
}
