// A stand-in for the RAWG API with a fixed catalog, so e2e runs are deterministic
// and never spend the real API quota. Run directly by Node: node e2e/support/fake-rawg-server.ts
import { createServer, type ServerResponse } from 'node:http';

interface FakeRawgGame {
  id: number;
  slug: string;
  name: string;
  released: string | null;
  background_image: null;
  genres: { id: number; name: string; slug: string }[];
  platforms: { platform: { id: number; name: string; slug: string } }[];
  description_raw: string;
}

const PC = { platform: { id: 4, name: 'PC', slug: 'pc' } };
const SWITCH = {
  platform: { id: 7, name: 'Nintendo Switch', slug: 'nintendo-switch' },
};
const ACTION = { id: 4, name: 'Action', slug: 'action' };
const INDIE = { id: 51, name: 'Indie', slug: 'indie' };
const PLATFORMER = { id: 83, name: 'Platformer', slug: 'platformer' };

const CATALOG: FakeRawgGame[] = [
  {
    id: 9767,
    slug: 'hollow-knight',
    name: 'Hollow Knight',
    released: '2017-02-24',
    background_image: null,
    genres: [ACTION, INDIE],
    platforms: [PC, SWITCH],
    description_raw: 'Forge your own path in Hollow Knight!',
  },
  {
    id: 58812,
    slug: 'hollow-knight-silksong',
    name: 'Hollow Knight: Silksong',
    released: null,
    background_image: null,
    genres: [ACTION, INDIE],
    platforms: [PC, SWITCH],
    description_raw: 'Play as Hornet, princess-protector of Hallownest.',
  },
  {
    id: 28153,
    slug: 'celeste',
    name: 'Celeste',
    released: '2018-01-25',
    background_image: null,
    genres: [PLATFORMER, INDIE],
    platforms: [PC, SWITCH],
    description_raw:
      'Help Madeline survive her journey to the top of Celeste Mountain.',
  },
  {
    id: 274755,
    slug: 'hades',
    name: 'Hades',
    released: '2020-09-17',
    background_image: null,
    genres: [ACTION, INDIE],
    platforms: [PC, SWITCH],
    description_raw:
      'Defy the god of the dead as you hack and slash out of the Underworld.',
  },
];

function sendJson(response: ServerResponse, status: number, body: unknown) {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(body));
}

function toListItem({ description_raw: _description, ...game }: FakeRawgGame) {
  return game;
}

const server = createServer((request, response) => {
  const url = new URL(request.url ?? '/', 'http://localhost');

  if (url.pathname === '/games') {
    const search = url.searchParams.get('search')?.toLowerCase() ?? '';
    const page = Number(url.searchParams.get('page') ?? '1');
    const pageSize = Number(url.searchParams.get('page_size') ?? '20');
    const matches = CATALOG.filter((game) =>
      game.name.toLowerCase().includes(search),
    );
    const results = matches.slice((page - 1) * pageSize, page * pageSize);

    if (page > 1 && results.length === 0) {
      return sendJson(response, 404, { detail: 'Invalid page.' });
    }
    return sendJson(response, 200, {
      count: matches.length,
      results: results.map(toListItem),
    });
  }

  const detailsMatch = /^\/games\/(\d+)$/.exec(url.pathname);
  const game =
    detailsMatch && CATALOG.find(({ id }) => id === Number(detailsMatch[1]));
  if (game) {
    return sendJson(response, 200, game);
  }

  sendJson(response, 404, { detail: 'Not found.' });
});

server.listen(Number(process.env.PORT ?? 3200), () => {
  console.log(`Fake RAWG listening on port ${process.env.PORT ?? 3200}`);
});
