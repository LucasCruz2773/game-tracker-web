import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchActivityFeed } from './activity.api';
import type { ActivityListParams } from './activity.types';

export const activityQueryKeys = {
  all: ['activities'] as const,
  feed: (params: ActivityListParams) =>
    [...activityQueryKeys.all, 'feed', params] as const,
};

export function useActivityFeed(params: ActivityListParams) {
  return useQuery({
    queryKey: activityQueryKeys.feed(params),
    queryFn: ({ signal }) => fetchActivityFeed(params, signal),
    placeholderData: keepPreviousData,
  });
}
