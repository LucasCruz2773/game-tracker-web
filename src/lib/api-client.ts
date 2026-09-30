const API_BASE_PATH = '/api';

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

interface ApiRequestOptions {
  method?: HttpMethod;
  body?: unknown;
  signal?: AbortSignal;
}

interface ApiErrorBody {
  statusCode: number;
  message: string | string[];
}

export class ApiError extends Error {
  readonly status: number;
  readonly messages: string[];

  constructor(status: number, messages: string[]) {
    super(messages[0] ?? `Request failed with status ${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.messages = messages;
  }
}

export function apiUrl(path: string): string {
  return `${API_BASE_PATH}${path}`;
}

export async function apiRequest<TResponse>(
  path: string,
  { method = 'GET', body, signal }: ApiRequestOptions = {},
): Promise<TResponse> {
  const headers = new Headers({ Accept: 'application/json' });
  if (body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(apiUrl(path), {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    credentials: 'same-origin',
    signal,
  });

  if (!response.ok) {
    throw await toApiError(response);
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  return (await response.json()) as TResponse;
}

export function isApiError(error: unknown, status?: number): error is ApiError {
  return (
    error instanceof ApiError &&
    (status === undefined || error.status === status)
  );
}

async function toApiError(response: Response): Promise<ApiError> {
  const errorBody: unknown = await response.json().catch(() => null);

  if (isApiErrorBody(errorBody)) {
    const messages = Array.isArray(errorBody.message)
      ? errorBody.message
      : [errorBody.message];
    return new ApiError(response.status, messages);
  }

  return new ApiError(response.status, []);
}

function isApiErrorBody(value: unknown): value is ApiErrorBody {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const { statusCode, message } = value as Record<string, unknown>;
  return (
    typeof statusCode === 'number' &&
    (typeof message === 'string' || Array.isArray(message))
  );
}
