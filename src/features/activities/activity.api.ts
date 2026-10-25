import { apiRequest } from '../../lib/api-client';
import type { Paginated } from '../../types/pagination';
import type { Activity, ActivityListParams } from './activity.types';

export function fetchActivityFeed(
  { page, pageSize }: ActivityListParams,
  signal?: AbortSignal,
): Promise<Paginated<Activity>> {
  const query = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });
  return apiRequest(`/activities/feed?${query}`, { signal });
}
