export interface ApiErrorPayload {
  code?: string;
  message: string;
  fields?: Record<string, string>;
}

export class ApiError extends Error {
  public status: number;
  public code?: string;
  public fields?: Record<string, string>;

  constructor(status: number, message: string, code?: string, fields?: Record<string, string>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.fields = fields;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

const BASE_URL = import.meta.env.VITE_API_URL || '';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...options.headers,
  };

  let response: Response;
  try {
    response = await fetch(url, { ...options, headers });
  } catch (err: any) {
    throw new ApiError(
      0,
      'Unable to connect to server. Please ensure the backend is running.',
      'NETWORK_ERROR'
    );
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  let data: any = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const errorData = data?.error;
    const message = errorData?.message || response.statusText || 'An error occurred';
    const code = errorData?.code;
    const fields = errorData?.fields;
    throw new ApiError(response.status, message, code, fields);
  }

  return (data?.data !== undefined ? data.data : data) as T;
}

export const http = {
  get: <T>(url: string, options?: RequestInit) =>
    request<T>(url, { method: 'GET', ...options }),
  post: <T>(url: string, body: any, options?: RequestInit) =>
    request<T>(url, { method: 'POST', body: JSON.stringify(body), ...options }),
  put: <T>(url: string, body: any, options?: RequestInit) =>
    request<T>(url, { method: 'PUT', body: JSON.stringify(body), ...options }),
  delete: <T>(url: string, options?: RequestInit) =>
    request<T>(url, { method: 'DELETE', ...options }),
};
