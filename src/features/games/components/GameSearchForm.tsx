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
        className="min-w-0 flex-1 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 placeholder:text-zinc-500 focus:border-violet-500 focus:outline-none"
      />
      <button
        type="submit"
        className="rounded-lg bg-violet-600 px-5 py-2.5 font-medium hover:bg-violet-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
      >
        Buscar
      </button>
    </form>
  );
}
