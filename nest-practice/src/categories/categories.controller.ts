import {
  Controller,
  Param,
  Get,
  Post,
  Put,
  Delete,
  Body,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('categories')
export class CategoriesController {
  // GET /categories
  @Get()
  findAll() {
    return [{ id: 1, name: 'Category 1' }, { id: 2, name: 'Category 2' }];
  }

  // GET /categories/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return { id, name: 'Category 1' };
  }

  // POST /categories
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return { id: '3', name: createCategoryDto.name };
  }

  // PUT /categories/:id
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: CreateCategoryDto,
  ) {
    return { id, ...updateCategoryDto };
  }

  // DELETE /categories/:id
  @Delete(':id')
  remove(@Param('id') id: string) {
    return { id };
  }
}
