import type { CurrentUser } from '../auth.types';
import { useLogout } from '../use-logout';
import { UserAvatar } from './UserAvatar';

interface UserMenuProps {
  user: CurrentUser;
}

export function UserMenu({ user }: UserMenuProps) {
  const logout = useLogout();

  return (
    <div className="flex items-center gap-3">
      <UserAvatar user={user} />
      <div className="hidden text-right leading-tight sm:block">
        <p className="text-sm font-medium">
          {user.displayName ?? user.username}
        </p>
        <p className="text-xs text-zinc-500">@{user.username}</p>
      </div>
      <button
        type="button"
        onClick={() => logout.mutate()}
        disabled={logout.isPending}
        className="rounded-lg border border-transparent px-3 py-1.5 text-xs font-bold tracking-wide text-zinc-300 uppercase hover:border-zinc-700 hover:bg-zinc-900 hover:text-white disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-brand-500"
      >
        {logout.isPending ? 'Saindo…' : 'Sair'}
      </button>
      {logout.isError && (
        <span role="alert" className="text-xs text-red-300">
          Não foi possível sair.
        </span>
      )}
    </div>
  );
}
