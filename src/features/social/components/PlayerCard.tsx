import { UserAvatar } from '../../auth/components/UserAvatar';
import type { SocialUser } from '../social.types';

interface PlayerCardProps {
  user: SocialUser;
  isUpdating: boolean;
  onToggleFollow: () => void;
}

export function PlayerCard({
  user,
  isUpdating,
  onToggleFollow,
}: PlayerCardProps) {
  return (
    <article className="retro-panel retro-card relative flex w-full flex-col p-5">
      <div className="flex min-w-0 items-center gap-3">
        <div className="scale-125">
          <UserAvatar user={user} />
        </div>
        <div className="min-w-0 pl-1">
          <h2 className="truncate text-base font-bold text-zinc-950">
            {user.displayName ?? user.username}
          </h2>
          <p className="truncate text-xs text-zinc-700">@{user.username}</p>
        </div>
      </div>

      <dl className="my-5 grid grid-cols-2 border-y border-zinc-600/50 py-3 text-center">
        <div>
          <dt className="text-[0.65rem] tracking-wider text-zinc-700 uppercase">
            Seguidores
          </dt>
          <dd className="mt-1 font-bold tabular-nums">{user.followerCount}</dd>
        </div>
        <div className="border-l border-zinc-600/50">
          <dt className="text-[0.65rem] tracking-wider text-zinc-700 uppercase">
            Seguindo
          </dt>
          <dd className="mt-1 font-bold tabular-nums">{user.followingCount}</dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={onToggleFollow}
        disabled={isUpdating}
        className={`${
          user.isFollowing ? 'console-secondary-button' : 'theme-primary-button'
        } mt-auto rounded-lg border px-4 py-2 text-xs font-bold tracking-wider uppercase disabled:opacity-50 focus-visible:outline-2`}
      >
        {isUpdating ? 'Salvando…' : user.isFollowing ? 'Seguindo' : 'Seguir'}
      </button>

      <div className="memory-card-caption mt-4 flex justify-between border px-2 py-1 text-[0.6rem] tracking-[0.15em] uppercase">
        <span>Player data</span>
        <span>Online</span>
      </div>
    </article>
  );
}
