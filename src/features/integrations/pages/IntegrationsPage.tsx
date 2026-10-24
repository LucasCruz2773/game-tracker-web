import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { ApiError } from '../../../lib/api-client';
import { ErrorState } from '../../../components/ErrorState';
import {
  dangerButtonClasses,
  primaryButtonClasses,
  secondaryButtonClasses,
} from '../../../components/form-classes';
import { Spinner } from '../../../components/Spinner';
import { STEAM_CONNECT_URL } from '../steam.api';
import type { SteamLibraryItem } from '../steam.types';
import {
  useDisconnectSteam,
  useImportSteamGames,
  useSteamStatus,
  useSyncSteamLibrary,
} from '../use-steam-integration';

const MAX_IMPORT_SIZE = 25;

export function IntegrationsPage() {
  const [searchParams] = useSearchParams();
  const status = useSteamStatus();
  const sync = useSyncSteamLibrary();
  const importGames = useImportSteamGames();
  const disconnect = useDisconnectSteam();
  const [selectedAppIds, setSelectedAppIds] = useState<Set<number>>(new Set());
  const [newlyImportedAppIds, setNewlyImportedAppIds] = useState<Set<number>>(
    new Set(),
  );
  const connectionResult = searchParams.get('steam');

  const availableItems = useMemo(
    () =>
      (sync.data?.items ?? []).filter(
        (item) => !item.imported && !newlyImportedAppIds.has(item.appId),
      ),
    [newlyImportedAppIds, sync.data?.items],
  );

  if (status.isPending) {
    return (
      <div className="flex justify-center py-16">
        <Spinner label="Carregando integrações…" />
      </div>
    );
  }

  if (status.isError) {
    return (
      <ErrorState
        title="Não foi possível carregar as integrações"
        description={errorMessage(status.error)}
        onRetry={() => void status.refetch()}
      />
    );
  }

  const account = status.data.account;

  function toggleSelection(appId: number) {
    setSelectedAppIds((current) => {
      const next = new Set(current);
      if (next.has(appId)) {
        next.delete(appId);
      } else if (next.size < MAX_IMPORT_SIZE) {
        next.add(appId);
      }
      return next;
    });
  }

  function selectAvailable() {
    setSelectedAppIds(
      new Set(
        availableItems.slice(0, MAX_IMPORT_SIZE).map((item) => item.appId),
      ),
    );
  }

  function submitImport() {
    const appIds = [...selectedAppIds];
    importGames.mutate(appIds, {
      onSuccess: (result) => {
        const unmatched = new Set(result.unmatchedAppIds);
        setNewlyImportedAppIds(
          (current) =>
            new Set([
              ...current,
              ...appIds.filter((appId) => !unmatched.has(appId)),
            ]),
        );
        setSelectedAppIds(new Set(result.unmatchedAppIds));
      },
    });
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Integrações</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Importe jogos e mantenha as horas jogadas sincronizadas.
        </p>
      </header>

      {connectionResult === 'connected' && (
        <Notice tone="success">Conta Steam conectada com sucesso.</Notice>
      )}
      {connectionResult === 'connection_failed' && (
        <Notice tone="error">
          Não foi possível conectar a conta Steam. Tente novamente.
        </Notice>
      )}

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {account?.avatarUrl ? (
              <img
                src={account.avatarUrl}
                alt=""
                className="size-14 rounded-lg bg-zinc-800"
              />
            ) : (
              <div className="flex size-14 items-center justify-center rounded-lg bg-zinc-800 text-xl font-bold">
                S
              </div>
            )}
            <div>
              <h2 className="text-lg font-semibold">Steam</h2>
              <p className="text-sm text-zinc-400">
                {account ? account.personaName : 'Nenhuma conta conectada'}
              </p>
              {account?.lastSyncedAt && (
                <p className="mt-1 text-xs text-zinc-500">
                  Última sincronização:{' '}
                  {new Date(account.lastSyncedAt).toLocaleString('pt-BR')}
                </p>
              )}
            </div>
          </div>

          {account ? (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => sync.mutate()}
                disabled={sync.isPending}
                className={primaryButtonClasses}
              >
                {sync.isPending ? 'Sincronizando…' : 'Sincronizar agora'}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (
                    window.confirm(
                      'Desconectar a Steam? Os jogos já importados continuarão na biblioteca.',
                    )
                  ) {
                    disconnect.mutate();
                  }
                }}
                disabled={disconnect.isPending}
                className={dangerButtonClasses}
              >
                Desconectar
              </button>
            </div>
          ) : (
            <a href={STEAM_CONNECT_URL} className={primaryButtonClasses}>
              Conectar Steam
            </a>
          )}
        </div>

        {sync.isError && (
          <p role="alert" className="mt-4 text-sm text-red-300">
            {errorMessage(sync.error)}
          </p>
        )}
        {disconnect.isError && (
          <p role="alert" className="mt-4 text-sm text-red-300">
            {errorMessage(disconnect.error)}
          </p>
        )}
      </div>

      {sync.data && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Jogos encontrados</h2>
              <p className="text-sm text-zinc-400">
                {sync.data.totalPlayed} com tempo jogado de{' '}
                {sync.data.totalOwned} jogos na conta. Novos jogos entram como
                Backlog para você definir o status correto.
              </p>
            </div>
            {availableItems.length > 0 && (
              <button
                type="button"
                onClick={selectAvailable}
                className={secondaryButtonClasses}
              >
                Selecionar até {MAX_IMPORT_SIZE}
              </button>
            )}
          </div>

          <ul className="divide-y divide-zinc-800 overflow-hidden rounded-xl border border-zinc-800">
            {sync.data.items.map((item) => {
              const imported =
                item.imported || newlyImportedAppIds.has(item.appId);
              const selected = selectedAppIds.has(item.appId);
              return (
                <SteamGameRow
                  key={item.appId}
                  item={item}
                  imported={imported}
                  selected={selected}
                  selectionDisabled={
                    !selected && selectedAppIds.size >= MAX_IMPORT_SIZE
                  }
                  onToggle={() => toggleSelection(item.appId)}
                />
              );
            })}
          </ul>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={submitImport}
              disabled={selectedAppIds.size === 0 || importGames.isPending}
              className={primaryButtonClasses}
            >
              {importGames.isPending
                ? 'Importando…'
                : `Importar selecionados (${selectedAppIds.size})`}
            </button>
            <span className="text-xs text-zinc-500">
              Limite de {MAX_IMPORT_SIZE} jogos por importação.
            </span>
          </div>

          {importGames.data && (
            <Notice tone="success">
              {importGames.data.imported} adicionados,{' '}
              {importGames.data.updated} atualizados e{' '}
              {importGames.data.unmatchedAppIds.length} sem correspondência
              exata no catálogo.
            </Notice>
          )}
          {importGames.isError && (
            <Notice tone="error">{errorMessage(importGames.error)}</Notice>
          )}
        </section>
      )}
    </section>
  );
}

interface SteamGameRowProps {
  item: SteamLibraryItem;
  imported: boolean;
  selected: boolean;
  selectionDisabled: boolean;
  onToggle: () => void;
}

function SteamGameRow({
  item,
  imported,
  selected,
  selectionDisabled,
  onToggle,
}: SteamGameRowProps) {
  return (
    <li className="flex items-center gap-3 bg-zinc-900/40 px-4 py-3">
      <input
        type="checkbox"
        aria-label={`Selecionar ${item.name}`}
        checked={selected}
        disabled={imported || selectionDisabled}
        onChange={onToggle}
        className="size-4 accent-violet-600 disabled:opacity-40"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{item.name}</p>
        <p className="text-xs text-zinc-500">Steam AppID {item.appId}</p>
      </div>
      <div className="text-right">
        <p className="text-sm tabular-nums">
          {formatPlaytime(item.playtimeMinutes)}
        </p>
        {imported && <p className="text-xs text-emerald-400">Importado</p>}
      </div>
    </li>
  );
}

function Notice({
  tone,
  children,
}: {
  tone: 'success' | 'error';
  children: React.ReactNode;
}) {
  return (
    <p
      role={tone === 'error' ? 'alert' : 'status'}
      className={`rounded-lg border px-4 py-3 text-sm ${
        tone === 'success'
          ? 'border-emerald-900 bg-emerald-950/40 text-emerald-300'
          : 'border-red-900 bg-red-950/40 text-red-300'
      }`}
    >
      {children}
    </p>
  );
}

function formatPlaytime(minutes: number): string {
  const hours = minutes / 60;
  return `${hours.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} h`;
}

function errorMessage(error: unknown): string {
  return error instanceof ApiError
    ? error.messages.join(' ')
    : 'Ocorreu um erro inesperado. Tente novamente.';
}
