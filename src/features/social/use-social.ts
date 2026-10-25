import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  type QueryKey,
} from '@tanstack/react-query';
import type { Paginated } from '../../types/pagination';
import type { LibraryListParams } from '../library/library.types';
import {
  fetchPublicLibrary,
  fetchPublicProfile,
  fetchPublicSummary,
  fetchSocialConnections,
  fetchSocialSummary,
  fetchSocialUsers,
  followUser,
  unfollowUser,
} from './social.api';
import type {
  SocialConnectionKind,
  SocialUser,
  SocialUserListParams,
} from './social.types';

export const socialQueryKeys = {
  all: ['social'] as const,
  lists: () => [...socialQueryKeys.all, 'lists'] as const,
  list: (params: SocialUserListParams) =>
    [...socialQueryKeys.lists(), 'users', params] as const,
  connections: (kind: SocialConnectionKind, params: SocialUserListParams) =>
    [...socialQueryKeys.lists(), 'connections', kind, params] as const,
  summary: () => [...socialQueryKeys.all, 'summary'] as const,
  profile: (username: string) =>
    [...socialQueryKeys.all, 'profile', username] as const,
  publicLibrary: (username: string, params: LibraryListParams) =>
    [...socialQueryKeys.all, 'profile', username, 'library', params] as const,
  publicSummary: (username: string) =>
    [...socialQueryKeys.all, 'profile', username, 'summary'] as const,
};

export function useSocialUsers(params: SocialUserListParams) {
  return useQuery({
    queryKey: socialQueryKeys.list(params),
    queryFn: ({ signal }) => fetchSocialUsers(params, signal),
    placeholderData: keepPreviousData,
  });
}

export function useSocialSummary() {
  return useQuery({
    queryKey: socialQueryKeys.summary(),
    queryFn: ({ signal }) => fetchSocialSummary(signal),
  });
}

export function useSocialConnections(
  kind: SocialConnectionKind,
  params: SocialUserListParams,
) {
  return useQuery({
    queryKey: socialQueryKeys.connections(kind, params),
    queryFn: ({ signal }) => fetchSocialConnections(kind, params, signal),
    placeholderData: keepPreviousData,
  });
}

export function usePublicProfile(username: string) {
  return useQuery({
    queryKey: socialQueryKeys.profile(username),
    queryFn: ({ signal }) => fetchPublicProfile(username, signal),
  });
}

export function usePublicLibrary(username: string, params: LibraryListParams) {
  return useQuery({
    queryKey: socialQueryKeys.publicLibrary(username, params),
    queryFn: ({ signal }) => fetchPublicLibrary(username, params, signal),
    placeholderData: keepPreviousData,
  });
}

export function usePublicSummary(username: string) {
  return useQuery({
    queryKey: socialQueryKeys.publicSummary(username),
    queryFn: ({ signal }) => fetchPublicSummary(username, signal),
    staleTime: 60_000,
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
      queryClient.invalidateQueries({ queryKey: socialQueryKeys.all }),
  });
}
