import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchCurrentUser, updateCurrentProfile } from './auth.api';
import type { CurrentUser, UserProfileChanges } from './auth.types';

export const currentUserQueryKey = ['auth', 'me'] as const;

/** `data` is `null` when there is no valid session. */
export function useCurrentUser() {
  return useQuery({
    queryKey: currentUserQueryKey,
    queryFn: ({ signal }) => fetchCurrentUser(signal),
    staleTime: 5 * 60_000,
  });
}

/** For components rendered under `<RequireAuth>`, where a session is guaranteed. */
export function useAuthenticatedUser(): CurrentUser {
  const { data: currentUser } = useCurrentUser();
  if (!currentUser) {
    throw new Error('useAuthenticatedUser must be used under <RequireAuth>');
  }
  return currentUser;
}

export function useUpdateCurrentProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (changes: UserProfileChanges) => updateCurrentProfile(changes),
    onSuccess: (user) => {
      queryClient.setQueryData(currentUserQueryKey, user);
      return queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}
