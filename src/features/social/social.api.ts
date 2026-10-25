import { apiRequest } from '../../lib/api-client';
import type { Paginated } from '../../types/pagination';
import type {
  FollowStatus,
  SocialUser,
  SocialUserListParams,
} from './social.types';

export function fetchSocialUsers(
  { search, page, pageSize }: SocialUserListParams,
  signal?: AbortSignal,
): Promise<Paginated<SocialUser>> {
  const query = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });
  if (search) query.set('search', search);

  return apiRequest(`/users?${query}`, { signal });
}

export function followUser(username: string): Promise<FollowStatus> {
  return apiRequest(`/users/${encodeURIComponent(username)}/follow`, {
    method: 'POST',
  });
}

export function unfollowUser(username: string): Promise<void> {
  return apiRequest(`/users/${encodeURIComponent(username)}/follow`, {
    method: 'DELETE',
  });
}
