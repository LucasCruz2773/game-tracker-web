import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  type QueryKey,
} from '@tanstack/react-query';
import type { Paginated } from '../../types/pagination';
import { fetchSocialUsers, followUser, unfollowUser } from './social.api';
import type { SocialUser, SocialUserListParams } from './social.types';

export const socialQueryKeys = {
  all: ['social'] as const,
  lists: () => [...socialQueryKeys.all, 'users'] as const,
  list: (params: SocialUserListParams) =>
    [...socialQueryKeys.lists(), params] as const,
};

export function useSocialUsers(params: SocialUserListParams) {
  return useQuery({
    queryKey: socialQueryKeys.list(params),
    queryFn: ({ signal }) => fetchSocialUsers(params, signal),
    placeholderData: keepPreviousData,
  });
}

interface ToggleFollowInput {
  username: string;
  currentlyFollowing: boolean;
}

interface ToggleFollowContext {
  snapshots: [QueryKey, Paginated<SocialUser> | undefined][];
}

export function useToggleFollow() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, ToggleFollowInput, ToggleFollowContext>({
    mutationFn: async ({ username, currentlyFollowing }) => {
      if (currentlyFollowing) {
        await unfollowUser(username);
      } else {
        await followUser(username);
      }
    },
    onMutate: async ({ username, currentlyFollowing }) => {
      await queryClient.cancelQueries({ queryKey: socialQueryKeys.lists() });
      const snapshots = queryClient.getQueriesData<Paginated<SocialUser>>({
        queryKey: socialQueryKeys.lists(),
      });

      queryClient.setQueriesData<Paginated<SocialUser>>(
        { queryKey: socialQueryKeys.lists() },
        (current) =>
          current && {
            ...current,
            items: current.items.map((user) =>
              user.username === username
                ? {
                    ...user,
                    isFollowing: !currentlyFollowing,
                    followerCount: Math.max(
                      0,
                      user.followerCount + (currentlyFollowing ? -1 : 1),
                    ),
                  }
                : user,
            ),
          },
      );

      return { snapshots };
    },
    onError: (_error, _input, context) => {
      for (const [queryKey, snapshot] of context?.snapshots ?? []) {
        queryClient.setQueryData(queryKey, snapshot);
      }
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: socialQueryKeys.lists() }),
  });
}
