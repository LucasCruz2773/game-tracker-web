import { useState } from 'react';
import type { ReviewAuthor } from '../reviews.types';

interface ReviewAuthorHeaderProps {
  author: ReviewAuthor;
}

export function ReviewAuthorHeader({ author }: ReviewAuthorHeaderProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const name = author.displayName ?? author.username;

  return (
    <div className="flex items-center gap-3">
      {author.avatarUrl && !imageFailed ? (
        <img
          src={author.avatarUrl}
          alt=""
          referrerPolicy="no-referrer"
          onError={() => setImageFailed(true)}
          className="size-9 rounded-full bg-zinc-800 object-cover"
        />
      ) : (
        <span
          aria-hidden="true"
          className="theme-avatar flex size-9 items-center justify-center rounded-full border text-sm font-semibold uppercase"
        >
          {name.charAt(0)}
        </span>
      )}
      <div className="min-w-0 leading-tight">
        <p className="truncate font-medium">{name}</p>
        <p className="text-xs text-zinc-700">@{author.username}</p>
      </div>
    </div>
  );
}
