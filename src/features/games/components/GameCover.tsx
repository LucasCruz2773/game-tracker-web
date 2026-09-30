import { useState } from 'react';

interface GameCoverProps {
  title: string;
  coverUrl: string | null;
  className?: string;
}

export function GameCover({ title, coverUrl, className = '' }: GameCoverProps) {
  const [imageFailed, setImageFailed] = useState(false);

  if (!coverUrl || imageFailed) {
    return (
      <div
        aria-hidden="true"
        className={`flex items-center justify-center bg-linear-to-br from-zinc-800 to-zinc-900 text-3xl font-bold text-zinc-600 ${className}`}
      >
        {title.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={coverUrl}
      alt=""
      loading="lazy"
      onError={() => setImageFailed(true)}
      className={`bg-zinc-900 object-cover ${className}`}
    />
  );
}
