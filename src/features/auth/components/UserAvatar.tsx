import { useState } from 'react';
import type { CurrentUser } from '../auth.types';

interface UserAvatarProps {
  user: Pick<CurrentUser, 'avatarUrl' | 'displayName' | 'username'>;
}

export function UserAvatar({ user }: UserAvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const name = user.displayName ?? user.username;

  if (user.avatarUrl && !imageFailed) {
    return (
      <img
        src={user.avatarUrl}
        alt=""
        // Google's avatar CDN may reject requests that carry a Referer.
        referrerPolicy="no-referrer"
        onError={() => setImageFailed(true)}
        className="size-8 rounded-full bg-zinc-800 object-cover"
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className="theme-avatar flex size-8 items-center justify-center rounded-full border text-sm font-semibold uppercase"
    >
      {name.charAt(0)}
    </span>
  );
}
