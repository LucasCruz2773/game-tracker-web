import { useState, type FormEvent } from 'react';

const MAX_SEARCH_LENGTH = 100;

interface GameSearchFormProps {
  initialSearch: string;
  onSearch: (search: string) => void;
}

export function GameSearchForm({
  initialSearch,
  onSearch,
}: GameSearchFormProps) {
  const [search, setSearch] = useState(initialSearch);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch(search.trim());
  }

  return (
    <form role="search" onSubmit={handleSubmit} className="flex gap-2">
      <label htmlFor="game-search" className="sr-only">
        Buscar jogos
      </label>
      <input
        id="game-search"
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        maxLength={MAX_SEARCH_LENGTH}
        placeholder="Buscar jogos, ex.: Hollow Knight"
        className="min-w-0 flex-1 rounded-lg border border-zinc-700 bg-black/50 px-4 py-2.5 font-mono text-sm placeholder:text-zinc-600 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/40"
      />
      <button
        type="submit"
        className="theme-primary-button rounded-lg border px-5 py-2.5 text-sm font-bold tracking-wider uppercase shadow-[3px_3px_0_rgba(0,0,0,0.8)] active:translate-x-px active:translate-y-px active:shadow-none focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        Buscar
      </button>
    </form>
  );
}
