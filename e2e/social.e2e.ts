import type { APIRequestContext } from '@playwright/test';
import type { SignedInTestUser } from './support/fixtures.ts';
import { expect, test } from './support/fixtures.ts';

interface GameSearchResponse {
  items: { id: string; title: string }[];
}

function authHeaders(user: SignedInTestUser) {
  return { Cookie: `${user.cookieName}=${user.token}` };
}

async function addGameToLibrary(
  request: APIRequestContext,
  user: SignedInTestUser,
) {
  const search = await request.get(
    '/api/games?search=celeste&page=1&pageSize=20',
  );
  expect(search.ok()).toBeTruthy();
  const games = (await search.json()) as GameSearchResponse;
  const game = games.items.find(({ title }) => title === 'Celeste');
  expect(game).toBeDefined();

  const added = await request.post('/api/library', {
    headers: authHeaders(user),
    data: {
      gameId: game!.id,
      status: 'COMPLETED',
      hoursPlayed: 18,
    },
  });
  expect(added.ok()).toBeTruthy();

  const review = await request.post(`/api/games/${game!.id}/reviews`, {
    headers: authHeaders(user),
    data: { rating: 8 },
  });
  expect(review.ok()).toBeTruthy();
}

test('opens another player profile and browses their library and summary', async ({
  page,
  request,
  signIn,
}) => {
  const target = await signIn('Public Profile Target');
  await addGameToLibrary(request, target);
  await signIn('Public Profile Viewer');

  await page.goto('/players');
  await page
    .getByRole('searchbox', { name: 'Buscar jogadores' })
    .fill(target.username);
  await page.getByRole('button', { name: 'Buscar' }).click();

  const playerCard = page
    .getByRole('listitem')
    .filter({ hasText: `@${target.username}` });
  await expect(playerCard).toBeVisible();
  await playerCard.getByRole('link', { name: 'Ver perfil' }).click();

  await expect(page).toHaveURL(`/players/${target.username}/library`);
  await expect(
    page.getByRole('heading', {
      name: `Biblioteca de @${target.username}`,
    }),
  ).toBeVisible();

  const publicLibrarySearch = page.getByRole('searchbox', {
    name: `Buscar jogos na biblioteca de @${target.username}`,
  });
  await publicLibrarySearch.fill('Celeste');
  await publicLibrarySearch.press('Enter');
  await expect(page).toHaveURL(`/players/${target.username}/library?q=Celeste`);

  const gameCard = page.getByRole('listitem').filter({ hasText: 'Celeste' });
  await expect(gameCard).toContainText('18 h jogadas');
  await expect(gameCard).toContainText('Concluído');
  await expect(gameCard).toContainText('4 / 5');

  await publicLibrarySearch.fill('Hades');
  await publicLibrarySearch.press('Enter');
  await expect(
    page.getByRole('heading', {
      name: 'Nenhum jogo encontrado para “Hades”',
    }),
  ).toBeVisible();

  await publicLibrarySearch.fill('');
  await publicLibrarySearch.press('Enter');

  await page.getByRole('link', { name: 'Resumo', exact: true }).click();
  await expect(page).toHaveURL(`/players/${target.username}/summary`);
  await expect(page.getByText('Total de jogos')).toBeVisible();
  await expect(page.getByText('Horas jogadas')).toBeVisible();
  await expect(page.getByText('18', { exact: true })).toBeVisible();
  await expect(page.getByText('4 / 5')).toBeVisible();
});

test('follows and unfollows a player from their public profile', async ({
  page,
  signIn,
}) => {
  const target = await signIn('Follow Target');
  await signIn('Follow Viewer');
  await page.goto(`/players/${target.username}/library`);

  const followButton = page.getByRole('button', {
    name: 'Seguir',
    exact: true,
  });
  await followButton.click();
  await expect(
    page.getByRole('button', { name: 'Seguindo', exact: true }),
  ).toBeVisible();

  await page.getByRole('button', { name: 'Seguindo', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Seguir', exact: true }),
  ).toBeVisible();
});
