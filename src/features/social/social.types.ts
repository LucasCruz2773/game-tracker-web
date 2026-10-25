export interface SocialUser {
  id: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  followerCount: number;
  followingCount: number;
  isFollowing: boolean;
}

export interface SocialUserListParams {
  search?: string;
  page: number;
  pageSize: number;
}

export type SocialConnectionKind = 'followers' | 'following';

export interface SocialSummary {
  followerCount: number;
  followingCount: number;
}

export interface PublicProfile {
  id: string;
  username: string;
  avatarUrl: string | null;
  followerCount: number;
  followingCount: number;
  isFollowing: boolean;
  createdAt: string;
}

export interface FollowStatus {
  username: string;
  isFollowing: boolean;
}
