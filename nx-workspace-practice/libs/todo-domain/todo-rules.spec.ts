import { buildStatus, buildTodo } from './todo-rules';

const NOW = new Date('2026-07-22T00:00:00.000Z');

describe('buildTodo', () => {
  it('builds a new todo, defaulting status and stamping dateCreated', () => {
    const todo = buildTodo({ title: 'First' }, undefined, NOW, 5);

    expect(todo).toEqual({
      id: 5,
      title: 'First',
      description: undefined,
      deadline: undefined,
      dateCreated: NOW,
      status: { status: 'todo' },
    });
  });

  it('merges a draft over existing state while preserving id and dateCreated', () => {
    const existing = {
      id: 1,
      title: 'Old',
      dateCreated: new Date('2026-01-01T00:00:00.000Z'),
      status: { status: 'todo' as const },
    };

    const todo = buildTodo({ title: 'New', description: 'desc' }, existing, NOW);

    expect(todo.id).toBe(1);
    expect(todo.title).toBe('New');
    expect(todo.description).toBe('desc');
    expect(todo.dateCreated).toBe(existing.dateCreated);
  });
});

describe('buildStatus', () => {
  it('stamps dateFinished with `now` when moving to done', () => {
    const status = buildStatus({ status: 'done' }, NOW);

    expect(status).toEqual({ status: 'done', dateFinished: NOW });
  });

  it('drops dateFinished when moving from done back to a non-done status', () => {
    const status = buildStatus({ status: 'todo' }, NOW);

    expect(status).toEqual({ status: 'todo' });
  });

  it('leaves in-progress untouched', () => {
    const status = buildStatus({ status: 'in-progress' }, NOW);

    expect(status).toEqual({ status: 'in-progress' });
  });
});
