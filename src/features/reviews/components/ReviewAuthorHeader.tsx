import { useState } from 'react';
import { Link } from 'react-router';
import type { ReviewAuthor } from '../reviews.types';

interface ReviewAuthorHeaderProps {
  author: ReviewAuthor;
}

export function ReviewAuthorHeader({ author }: ReviewAuthorHeaderProps) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <Link
      to={`/players/${encodeURIComponent(author.username)}`}
      className="flex items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-brand-500"
      aria-label={`Abrir perfil de ${author.username}`}
    >
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
          {author.username.charAt(0)}
        </span>
      )}
      <div className="min-w-0 leading-tight">
        <p className="truncate font-medium">@{author.username}</p>
      </div>
    </Link>
  );
}
