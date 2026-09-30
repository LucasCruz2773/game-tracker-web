import { apiRequest, apiUrl, isApiError } from '../../lib/api-client';
import type { CurrentUser } from './auth.types';

// A full-page navigation, not a fetch: the API redirects to Google and back.
export const GOOGLE_SIGN_IN_URL = apiUrl('/auth/google');

export async function fetchCurrentUser(
  signal?: AbortSignal,
): Promise<CurrentUser | null> {
  try {
    return await apiRequest<CurrentUser>('/auth/me', { signal });
  } catch (error) {
    if (isApiError(error, 401)) {
      return null;
    }
    throw error;
  }
}

export function logout(): Promise<void> {
  return apiRequest<void>('/auth/logout', { method: 'POST' });
}
