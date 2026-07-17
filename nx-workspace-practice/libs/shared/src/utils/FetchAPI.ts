export default async function fetchApi<T>(url?: string, options?: RequestInit): Promise<T> {
  const response = await fetch(
    'http://localhost:3000/api/' + (url || ''),
    options
  );

  return response.json() as Promise<T>;
}