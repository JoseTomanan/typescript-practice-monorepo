import { Test } from '@nestjs/testing';
import { TodosController } from './todos.controller';
import { TodosService } from '../application/todos.service';

describe('TodosController', () => {
  let controller: TodosController;
  let service: jest.Mocked<TodosService>;

  beforeEach(async () => {
    const serviceMock: Partial<jest.Mocked<TodosService>> = {
      getTodos: jest.fn(),
      getTodo: jest.fn(),
      createTodo: jest.fn(),
      updateTodo: jest.fn(),
      updateTodoStatus: jest.fn(),
      deleteTodo: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [TodosController],
      providers: [{ provide: TodosService, useValue: serviceMock }],
    }).compile();

    controller = moduleRef.get(TodosController);
    service = moduleRef.get(TodosService);
  });

  it('delegates getTodos to the service', () => {
    controller.getTodos();
    expect(service.getTodos).toHaveBeenCalledTimes(1);
  });

  it('delegates getTodo with the parsed id', () => {
    controller.getTodo(5);
    expect(service.getTodo).toHaveBeenCalledWith(5);
  });

  it('delegates createTodo with the body', () => {
    const dto = { title: 'New' };
    controller.createTodo(dto);
    expect(service.createTodo).toHaveBeenCalledWith(dto);
  });

  it('delegates updateTodo with id and body', () => {
    const dto = { title: 'Edit' };
    controller.updateTodo(3, dto);
    expect(service.updateTodo).toHaveBeenCalledWith(3, dto);
  });

  it('delegates updateTodoStatus with id and body', () => {
    const dto = { status: { status: 'done' as const } };
    controller.updateTodoStatus(3, dto);
    expect(service.updateTodoStatus).toHaveBeenCalledWith(3, dto);
  });

  it('delegates deleteTodo with the parsed id', () => {
    controller.deleteTodo(9);
    expect(service.deleteTodo).toHaveBeenCalledWith(9);
  });
});
