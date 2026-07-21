import axios from 'axios';

// Runs against the real API served on http://localhost:3000 (baseURL is set in
// src/support/test-setup.ts). The store is in-memory and shared across the run,
// so every test creates its own todo and operates on the returned id.
describe('Todos API (E2E)', () => {
  async function createTodo(title: string) {
    const res = await axios.post('/api/todos', { title });
    return res;
  }

  describe('POST /api/todos', () => {
    it('creates a todo and returns it with an id', async () => {
      const res = await createTodo('E2E created');

      expect(res.status).toBe(201);
      expect(res.data.title).toBe('E2E created');
      expect(typeof res.data.id).toBe('number');
      expect(res.data.status).toEqual({ status: 'todo' });
    });

    it('rejects an empty title with a 400 validation error', async () => {
      const res = await axios.post(
        '/api/todos',
        { title: '' },
        { validateStatus: () => true }
      );

      expect(res.status).toBe(400);
      expect(res.data.message).toBe('Validation failed');
    });
  });

  describe('GET /api/todos', () => {
    it('lists created todos', async () => {
      const created = await createTodo('Listed item');

      const res = await axios.get('/api/todos');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.data.list)).toBe(true);
      expect(res.data.list.some((t: { id: number }) => t.id === created.data.id)).toBe(true);
    });

    it('gets a single todo by id', async () => {
      const created = await createTodo('Single item');

      const res = await axios.get(`/api/todos/${created.data.id}`);

      expect(res.status).toBe(200);
      expect(res.data.id).toBe(created.data.id);
    });

    it('returns 404 for an unknown id', async () => {
      const res = await axios.get('/api/todos/999999', { validateStatus: () => true });

      expect(res.status).toBe(404);
    });
  });

  describe('PATCH /api/todos/:id', () => {
    it('updates the title and description', async () => {
      const created = await createTodo('Before edit');

      const res = await axios.patch(`/api/todos/${created.data.id}`, {
        title: 'After edit',
        description: 'updated',
      });

      expect(res.status).toBe(200);
      expect(res.data.id).toBe(created.data.id);
      expect(res.data.title).toBe('After edit');
      expect(res.data.description).toBe('updated');
    });
  });

  describe('PATCH /api/todos/:id/status', () => {
    it('marks a todo done and stamps dateFinished', async () => {
      const created = await createTodo('To complete');

      const res = await axios.patch(`/api/todos/${created.data.id}/status`, {
        status: { status: 'done' },
      });

      expect(res.status).toBe(200);
      expect(res.data.status.status).toBe('done');
      expect(res.data.status.dateFinished).toBeDefined();
    });
  });

  describe('DELETE /api/todos/:id', () => {
    it('deletes a todo, then a follow-up GET returns 404', async () => {
      const created = await createTodo('To delete');

      const del = await axios.delete(`/api/todos/${created.data.id}`);
      expect(del.status).toBe(200);
      expect(del.data).toEqual({ deleted: true });

      const after = await axios.get(`/api/todos/${created.data.id}`, {
        validateStatus: () => true,
      });
      expect(after.status).toBe(404);
    });
  });
});
