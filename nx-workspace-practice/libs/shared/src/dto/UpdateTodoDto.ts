import { CreateTodoDto } from './CreateTodoDto';

export interface UpdateTodoDto extends Partial<CreateTodoDto> {}