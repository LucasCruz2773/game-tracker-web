import { useState } from 'react';
import type { CurrentUser } from '../auth.types';

interface UserAvatarProps {
  user: Pick<CurrentUser, 'avatarUrl' | 'username'>;
  size?: 'small' | 'large';
}

export function UserAvatar({ user, size = 'small' }: UserAvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const sizeClasses = size === 'large' ? 'size-24 text-3xl' : 'size-8 text-sm';

  if (user.avatarUrl && !imageFailed) {
    return (
      <img
        src={user.avatarUrl}
        alt=""
        // Google's avatar CDN may reject requests that carry a Referer.
        referrerPolicy="no-referrer"
        onError={() => setImageFailed(true)}
        className={`${sizeClasses} rounded-full bg-zinc-800 object-cover`}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`theme-avatar flex items-center justify-center rounded-full border font-semibold uppercase ${sizeClasses}`}
    >
      {user.username.charAt(0)}
    </span>
  );
}
