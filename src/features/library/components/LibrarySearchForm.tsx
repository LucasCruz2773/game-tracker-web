import { useState, type FormEvent } from 'react';

interface LibrarySearchFormProps {
  initialSearch: string;
  onSearch: (search: string) => void;
  owner?: string;
}

export function LibrarySearchForm({
  initialSearch,
  onSearch,
  owner,
}: LibrarySearchFormProps) {
  const [search, setSearch] = useState(initialSearch);
  const label = owner
    ? `Buscar jogos na biblioteca de @${owner}`
    : 'Buscar jogos na minha biblioteca';

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch(search.trim());
  }

  return (
    <form role="search" onSubmit={handleSubmit} className="flex gap-2">
      <label htmlFor="library-search" className="sr-only">
        {label}
      </label>
      <input
        id="library-search"
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        maxLength={100}
        placeholder="Buscar jogo na biblioteca"
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
