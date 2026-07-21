import { TodoStatusSchema } from '../types/TodoItem';
import { CreateTodoSchema } from './CreateTodoDto';
import { UpdateTodoSchema } from './UpdateTodoDto';
import { UpdateTodoStatusSchema } from './UpdateTodoStatusDto';

describe('CreateTodoSchema', () => {
  it('accepts a title-only payload', () => {
    const result = CreateTodoSchema.safeParse({ title: 'Buy milk' });

    expect(result.success).toBe(true);
  });

  it('rejects a missing title', () => {
    const result = CreateTodoSchema.safeParse({});

    expect(result.success).toBe(false);
  });

  it('rejects an empty title (min length 1)', () => {
    const result = CreateTodoSchema.safeParse({ title: '' });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('title is required');
    }
  });

  it('accepts optional description and status', () => {
    const result = CreateTodoSchema.safeParse({
      title: 'Ship it',
      description: 'with tests',
      status: { status: 'in-progress' },
    });

    expect(result.success).toBe(true);
  });

  it('coerces a deadline string into a Date', () => {
    const result = CreateTodoSchema.safeParse({
      title: 'Deadline task',
      deadline: '2026-07-21',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.deadline).toBeInstanceOf(Date);
    }
  });
});

describe('UpdateTodoSchema', () => {
  it('accepts an empty object (all fields optional)', () => {
    expect(UpdateTodoSchema.safeParse({}).success).toBe(true);
  });

  it('accepts a partial update', () => {
    expect(UpdateTodoSchema.safeParse({ description: 'only this' }).success).toBe(true);
  });

  it('still rejects an empty title when one is supplied', () => {
    expect(UpdateTodoSchema.safeParse({ title: '' }).success).toBe(false);
  });
});

describe('TodoStatusSchema', () => {
  it.each(['todo', 'in-progress', 'done'])('accepts the %s status', (status) => {
    expect(TodoStatusSchema.safeParse({ status }).success).toBe(true);
  });

  it('rejects an unknown status', () => {
    expect(TodoStatusSchema.safeParse({ status: 'archived' }).success).toBe(false);
  });

  it('accepts a done status with a coerced dateFinished', () => {
    const result = TodoStatusSchema.safeParse({
      status: 'done',
      dateFinished: '2026-07-21T10:00:00.000Z',
    });

    expect(result.success).toBe(true);
    if (result.success && result.data.status === 'done') {
      expect(result.data.dateFinished).toBeInstanceOf(Date);
    }
  });
});

describe('UpdateTodoStatusSchema', () => {
  it('requires a status field', () => {
    expect(UpdateTodoStatusSchema.safeParse({}).success).toBe(false);
  });

  it('accepts a valid status wrapper', () => {
    expect(UpdateTodoStatusSchema.safeParse({ status: { status: 'done' } }).success).toBe(true);
  });
});
