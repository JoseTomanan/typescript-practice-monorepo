import { NotFoundException } from '@nestjs/common';
import { TodosService } from './todos.service';

describe('TodosService', () => {
  let service: TodosService;

  // Fresh instance per test → the in-memory list starts empty and stays isolated.
  beforeEach(() => {
    service = new TodosService();
  });

  describe('createTodo', () => {
    it('creates a todo with the given title and stores it', () => {
      const created = service.createTodo({ title: 'First' });

      expect(created.title).toBe('First');
      expect(service.getTodos().list).toHaveLength(1);
    });

    it('assigns incrementing ids starting at 1', () => {
      const a = service.createTodo({ title: 'A' });
      const b = service.createTodo({ title: 'B' });
      const c = service.createTodo({ title: 'C' });

      expect([a.id, b.id, c.id]).toEqual([1, 2, 3]);
    });

    it('defaults the status to "todo" and stamps dateCreated', () => {
      const created = service.createTodo({ title: 'Defaults' });

      expect(created.status).toEqual({ status: 'todo' });
      expect(created.dateCreated).toBeInstanceOf(Date);
    });
  });

  describe('getTodo', () => {
    it('returns the matching todo', () => {
      const created = service.createTodo({ title: 'Find me' });

      expect(service.getTodo(created.id as number)).toEqual(created);
    });

    it('throws NotFoundException for an unknown id', () => {
      expect(() => service.getTodo(999)).toThrow(NotFoundException);
    });
  });

  describe('updateTodo', () => {
    it('updates fields while preserving the id', () => {
      const created = service.createTodo({ title: 'Old' });

      const updated = service.updateTodo(created.id as number, {
        title: 'New',
        description: 'desc',
      });

      expect(updated.id).toBe(created.id);
      expect(updated.title).toBe('New');
      expect(updated.description).toBe('desc');
    });

    it('throws NotFoundException for an unknown id', () => {
      expect(() => service.updateTodo(999, { title: 'X' })).toThrow(NotFoundException);
    });
  });

  describe('updateTodoStatus', () => {
    it('stamps dateFinished when moving to done', () => {
      const created = service.createTodo({ title: 'Complete me' });

      const updated = service.updateTodoStatus(created.id as number, {
        status: { status: 'done' },
      });

      expect(updated.status.status).toBe('done');
      if (updated.status.status === 'done') {
        expect(updated.status.dateFinished).toBeInstanceOf(Date);
      }
    });

    it('does not stamp dateFinished for non-done statuses', () => {
      const created = service.createTodo({ title: 'In progress' });

      const updated = service.updateTodoStatus(created.id as number, {
        status: { status: 'in-progress' },
      });

      expect(updated.status).toEqual({ status: 'in-progress' });
    });
  });

  describe('deleteTodo', () => {
    it('removes the todo and reports success', () => {
      const created = service.createTodo({ title: 'Bye' });

      expect(service.deleteTodo(created.id as number)).toEqual({ deleted: true });
      expect(service.getTodos().list).toHaveLength(0);
    });

    it('throws NotFoundException for an unknown id', () => {
      expect(() => service.deleteTodo(999)).toThrow(NotFoundException);
    });
  });
});
