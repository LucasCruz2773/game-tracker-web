import { apiRequest } from '../../lib/api-client';
import type { Paginated } from '../../types/pagination';
import type { LibraryStats } from '../dashboard/dashboard.types';
import type { LibraryEntry, LibraryListParams } from '../library/library.types';
import type {
  FollowStatus,
  PublicProfile,
  SocialConnectionKind,
  SocialSummary,
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

export function fetchSocialSummary(
  signal?: AbortSignal,
): Promise<SocialSummary> {
  return apiRequest('/users/me/social-summary', { signal });
}

export function fetchSocialConnections(
  kind: SocialConnectionKind,
  { page, pageSize }: SocialUserListParams,
  signal?: AbortSignal,
): Promise<Paginated<SocialUser>> {
  const query = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });

  return apiRequest(`/users/me/${kind}?${query}`, { signal });
}

export function fetchPublicProfile(
  username: string,
  signal?: AbortSignal,
): Promise<PublicProfile> {
  return apiRequest(`/users/${encodeURIComponent(username)}`, { signal });
}

export function fetchPublicLibrary(
  username: string,
  { search, status, sortBy, page, pageSize }: LibraryListParams,
  signal?: AbortSignal,
): Promise<Paginated<LibraryEntry>> {
  const query = new URLSearchParams({
    sortBy,
    page: String(page),
    pageSize: String(pageSize),
  });
  if (search) query.set('search', search);
  if (status) query.set('status', status);

  return apiRequest(`/users/${encodeURIComponent(username)}/library?${query}`, {
    signal,
  });
}

export function fetchPublicSummary(
  username: string,
  signal?: AbortSignal,
): Promise<LibraryStats> {
  return apiRequest(`/users/${encodeURIComponent(username)}/summary`, {
    signal,
  });
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
