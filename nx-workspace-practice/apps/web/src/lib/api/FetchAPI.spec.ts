import { fetchApi } from './FetchAPI';

describe('fetchApi', () => {
  const mockFetch = jest.fn();
  const ORIGINAL_API_URL = process.env.NEXT_PUBLIC_API_URL;

  beforeEach(() => {
    mockFetch.mockReset();
    global.fetch = mockFetch as unknown as typeof fetch;
    delete process.env.NEXT_PUBLIC_API_URL;
  });

  afterAll(() => {
    if (ORIGINAL_API_URL === undefined) {
      delete process.env.NEXT_PUBLIC_API_URL;
    } else {
      process.env.NEXT_PUBLIC_API_URL = ORIGINAL_API_URL;
    }
  });

  function jsonResponse(body: unknown, ok = true, status = 200) {
    return {
      ok,
      status,
      json: async () => body,
    } as Response;
  }

  it('prefixes the path with the default API base URL when NEXT_PUBLIC_API_URL is unset', async () => {
    mockFetch.mockResolvedValue(jsonResponse({ ok: true }));

    await fetchApi('todos');

    expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/api/todos', undefined);
  });

  it('falls back to the base URL when no path is given', async () => {
    mockFetch.mockResolvedValue(jsonResponse({}));

    await fetchApi();

    expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/api/', undefined);
  });

  it('uses NEXT_PUBLIC_API_URL as the base URL when it is set', async () => {
    process.env.NEXT_PUBLIC_API_URL = 'https://example.test/api/';
    mockFetch.mockResolvedValue(jsonResponse({ ok: true }));

    await fetchApi('todos');

    expect(mockFetch).toHaveBeenCalledWith('https://example.test/api/todos', undefined);
  });

  it('passes request options straight through to fetch', async () => {
    mockFetch.mockResolvedValue(jsonResponse({ id: 1 }));
    const options = { method: 'POST', body: JSON.stringify({ title: 'X' }) };

    await fetchApi('todos', options);

    expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/api/todos', options);
  });

  it('returns the parsed JSON body on success', async () => {
    const payload = { id: 7, title: 'Parsed' };
    mockFetch.mockResolvedValue(jsonResponse(payload));

    await expect(fetchApi('todos/7')).resolves.toEqual(payload);
  });

  it('throws on a non-ok response instead of returning the error body', async () => {
    mockFetch.mockResolvedValue(jsonResponse({ message: 'Validation failed' }, false, 400));

    await expect(fetchApi('todos', { method: 'POST' })).rejects.toThrow(
      'failed with status 400'
    );
  });
});
