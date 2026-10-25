export interface CurrentUser {
  id: string;
  email: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  createdAt: string;
}

export interface UserProfileChanges {
  displayName: string | null;
  username: string;
  avatarUrl: string | null;
}

export type GoogleSignInErrorReason =
  | 'cancelled'
  | 'invalid_state'
  | 'google_rejected'
  | 'email_not_verified'
  | 'account_conflict'
  | 'unexpected_error';
