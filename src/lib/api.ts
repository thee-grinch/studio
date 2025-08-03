// src/lib/api.ts

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function fetchBackend(
  path: string,
  method: string,
  data?: any
): Promise<any> {
  const url = `${BACKEND_URL}${path}`;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const options: RequestInit = {
    method,
    headers,
  };

  if (data && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'An error occurred');
  }

  // Handle cases where the response might be empty (e.g., 204 No Content)
  if (response.status === 204) {
    return null;
  }

  return response.json();
}