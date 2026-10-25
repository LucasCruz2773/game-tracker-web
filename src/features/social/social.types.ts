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

export interface FollowStatus {
  username: string;
  isFollowing: boolean;
}
