export default async function fetchApi<T>(url?: string, options?: RequestInit): Promise<T> {
  const response = await fetch(
    'http://localhost:3000/api/' + (url || ''),
    options
  );

  // Surface HTTP errors instead of silently parsing (and returning) an error
  // body as if it were a `T`. Without this a failed request would corrupt the
  // caller's state — e.g. pushing an error object into the todo list.
  if (!response.ok) {
    throw new Error(`Request to ${url || ''} failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}