import { QueryClient } from '@tanstack/react-query';
import { ApiError } from './api-client';

const MAX_RETRIES = 2;

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: (failureCount, error) => {
          // Client errors (401, 404, 422...) won't succeed on retry.
          if (error instanceof ApiError && error.status < 500) {
            return false;
          }
          return failureCount < MAX_RETRIES;
        },
      },
    },
  });
}
