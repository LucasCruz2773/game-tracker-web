import { useState, type FormEvent } from 'react';

interface PlayerSearchFormProps {
  initialSearch: string;
  onSearch: (search: string) => void;
}

export function PlayerSearchForm({
  initialSearch,
  onSearch,
}: PlayerSearchFormProps) {
  const [search, setSearch] = useState(initialSearch);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch(search.trim());
  }

  return (
    <form role="search" onSubmit={handleSubmit} className="flex gap-2">
      <label htmlFor="player-search" className="sr-only">
        Buscar jogadores
      </label>
      <input
        id="player-search"
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        maxLength={50}
        placeholder="Buscar por nome ou usuário"
        className="console-input min-w-0 flex-1 rounded-lg border px-4 py-2.5 text-sm placeholder:text-zinc-600 focus:outline-2 focus:outline-offset-1"
      />
      <button
        type="submit"
        className="theme-primary-button rounded-lg border px-5 py-2.5 text-sm font-bold tracking-wider uppercase shadow-[3px_3px_0_rgba(0,0,0,0.65)] active:translate-x-px active:translate-y-px active:shadow-none focus-visible:outline-2"
      >
        Buscar
      </button>
    </form>
  );
}
