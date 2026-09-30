import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout } from './auth.api';
import { currentUserQueryKey } from './use-current-user';

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Drop every cached response that belonged to the previous user.
      queryClient.clear();
      queryClient.setQueryData(currentUserQueryKey, null);
    },
  });
}
