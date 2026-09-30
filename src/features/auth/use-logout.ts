import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout } from './auth.api';
import { currentUserQueryKey } from './use-current-user';

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Updating the session query (instead of clearing the whole cache) keeps
      // its observers attached, so <RequireAuth> sees the logout and redirects.
      queryClient.setQueryData(currentUserQueryKey, null);
      // Drop every other cached response that belonged to the previous user.
      queryClient.removeQueries({
        predicate: (query) => query.queryKey[0] !== currentUserQueryKey[0],
      });
    },
  });
}
