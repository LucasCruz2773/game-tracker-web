import { QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { RouterProvider } from 'react-router/dom';
import { createQueryClient } from '../lib/query-client';
import { I18nProvider } from '../i18n/i18n';
import { router } from './router';

export function App() {
  const [queryClient] = useState(createQueryClient);

  return (
    <I18nProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </I18nProvider>
  );
}
