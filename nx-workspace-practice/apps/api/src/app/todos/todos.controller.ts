import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  CreateTodoDto,
  UpdateTodoDto,
  UpdateTodoStatusDto,
} from 'shared';
import { TodosService } from './todos.service';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  getTodos() {
    return this.todosService.getTodos();
  }

  @Get(':id')
  getTodo(@Param('id', ParseIntPipe) id: number) {
    return this.todosService.getTodo(id);
  }

  @Post()
  createTodo(@Body() createTodoDto: CreateTodoDto) {
    return this.todosService.createTodo(createTodoDto);
  }

  @Patch(':id')
  updateTodo(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return this.todosService.updateTodo(id, updateTodoDto);
  }

  @Patch(':id/status')
  updateTodoStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoStatusDto: UpdateTodoStatusDto,
  ) {
    return this.todosService.updateTodoStatus(id, updateTodoStatusDto);
  }

  @Delete(':id')
  deleteTodo(@Param('id', ParseIntPipe) id: number) {
    return this.todosService.deleteTodo(id);
  }
}
