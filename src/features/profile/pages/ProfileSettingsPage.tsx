import { useState, type FormEvent } from 'react';
import {
  inputClasses,
  primaryButtonClasses,
  secondaryButtonClasses,
} from '../../../components/form-classes';
import { ApiError } from '../../../lib/api-client';
import { UserAvatar } from '../../auth/components/UserAvatar';
import {
  useAuthenticatedUser,
  useUpdateCurrentProfile,
} from '../../auth/use-current-user';

export function ProfileSettingsPage() {
  const user = useAuthenticatedUser();
  const updateProfile = useUpdateCurrentProfile();
  const [username, setUsername] = useState(user.username);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl ?? '');

  const previewUser = {
    username: username.trim() || user.username,
    avatarUrl: avatarUrl.trim() || null,
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateProfile.mutate({
      username: username.trim().toLowerCase(),
      avatarUrl: avatarUrl.trim() || null,
    });
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <div className="retro-panel rounded-xl p-5 sm:p-6">
        <p className="retro-kicker">Edit save // Player identity</p>
        <h1 className="retro-title mt-1 text-2xl font-semibold">
          Editar perfil
        </h1>
        <p className="mt-2 text-sm text-zinc-700">
          Personalize como seu perfil aparece para outros jogadores.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label htmlFor="profile-username" className="text-sm font-bold">
              Nick
            </label>
            <div className="mt-1.5 flex items-center">
              <span className="console-input flex h-[38px] items-center border border-r-0 px-3 text-zinc-700">
                @
              </span>
              <input
                id="profile-username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
                minLength={3}
                maxLength={30}
                pattern="[A-Za-z0-9_]{3,30}"
                autoComplete="username"
                className={`${inputClasses} rounded-l-none`}
              />
            </div>
            <p className="mt-1 text-xs text-zinc-700">
              Use de 3 a 30 letras, números ou underline. Salvaremos em
              minúsculas.
            </p>
          </div>

          <div>
            <label htmlFor="profile-avatar-url" className="text-sm font-bold">
              Foto de perfil
            </label>
            <input
              id="profile-avatar-url"
              type="url"
              value={avatarUrl}
              onChange={(event) => setAvatarUrl(event.target.value)}
              maxLength={2048}
              pattern="https://.*"
              placeholder="https://exemplo.com/minha-foto.png"
              className={`mt-1.5 ${inputClasses}`}
            />
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-zinc-700">
                Informe uma URL pública HTTPS para a imagem.
              </p>
              {avatarUrl && (
                <button
                  type="button"
                  onClick={() => setAvatarUrl('')}
                  className={secondaryButtonClasses}
                >
                  Remover foto
                </button>
              )}
            </div>
          </div>

          {updateProfile.isError && (
            <p role="alert" className="text-sm text-red-500">
              {profileErrorMessage(updateProfile.error)}
            </p>
          )}
          {updateProfile.isSuccess && (
            <p role="status" className="text-sm text-emerald-600">
              Perfil salvo com sucesso.
            </p>
          )}

          <button
            type="submit"
            disabled={updateProfile.isPending}
            className={primaryButtonClasses}
          >
            {updateProfile.isPending ? 'Salvando…' : 'Salvar perfil'}
          </button>
        </form>
      </div>

      <aside className="retro-panel retro-card h-fit p-5 text-center">
        <p className="retro-kicker">Preview // Player 1</p>
        <div className="mt-5 flex justify-center">
          <UserAvatar
            key={previewUser.avatarUrl}
            user={previewUser}
            size="large"
          />
        </div>
        <p className="mt-4 truncate text-lg font-bold">
          @{previewUser.username}
        </p>
        <div className="memory-card-caption mt-5 flex justify-between border px-2 py-1 text-[0.6rem] tracking-[0.15em] uppercase">
          <span>Player data</span>
          <span>Preview</span>
        </div>
      </aside>
    </section>
  );
}

function profileErrorMessage(error: unknown): string {
  if (error instanceof ApiError && error.status === 409) {
    return 'Esse nick já está sendo usado por outro jogador.';
  }
  if (error instanceof ApiError && error.status === 400) {
    return error.messages.join(' ');
  }
  return 'Não foi possível salvar seu perfil. Tente novamente.';
}
