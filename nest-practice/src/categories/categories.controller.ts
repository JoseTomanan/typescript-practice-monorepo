import {
  Controller,
  Param,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Body,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('categories')
export class CategoriesController {
  // GET /categories
  @Get()
  findAll(@Query('location') location: string) {
    return [{ location }];
  }

  // GET /categories/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return { id };
  }

  // POST /categories
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return { name: createCategoryDto.name };
  }

  // PUT /categories/:id
  @Put(':id')
  update() {
    // Logic to update a category
  }

  // DELETE /categories/:id
  @Delete(':id')
  remove() {
    // Logic to delete a category
  }
}
