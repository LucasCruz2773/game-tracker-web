import type { APIRequestContext } from '@playwright/test';
import type { SignedInTestUser } from './support/fixtures.ts';
import { expect, test } from './support/fixtures.ts';

interface GameSearchResponse {
  items: { id: string; title: string }[];
}

function authHeaders(user: SignedInTestUser) {
  return { Cookie: `${user.cookieName}=${user.token}` };
}

async function findGame(
  request: APIRequestContext,
  title: string,
): Promise<string> {
  const response = await request.get(
    `/api/games?search=${encodeURIComponent(title)}&page=1&pageSize=20`,
  );
  expect(response.ok()).toBeTruthy();
  const games = (await response.json()) as GameSearchResponse;
  const game = games.items.find((item) => item.title === title);
  expect(game).toBeDefined();
  return game!.id;
}

test('shows library, completion and review activities from followed players', async ({
  page,
  request,
  signIn,
}) => {
  const target = await signIn('Feed Target');
  const gameId = await findGame(request, 'Celeste');
  const headers = authHeaders(target);

  const added = await request.post('/api/library', {
    headers,
    data: { gameId, status: 'BACKLOG' },
  });
  expect(added.ok()).toBeTruthy();
  const completed = await request.patch(`/api/library/${gameId}`, {
    headers,
    data: { status: 'COMPLETED' },
  });
  expect(completed.ok()).toBeTruthy();
  const reviewed = await request.post(`/api/games/${gameId}/reviews`, {
    headers,
    data: { rating: 9, body: 'Uma escalada inesquecível.' },
  });
  expect(reviewed.ok()).toBeTruthy();

  const viewer = await signIn('Feed Viewer');
  const followed = await request.post(`/api/users/${target.username}/follow`, {
    headers: authHeaders(viewer),
  });
  expect(followed.ok()).toBeTruthy();

  await page.goto('/feed');
  await expect(
    page.getByRole('heading', { name: 'Feed de atividades' }),
  ).toBeVisible();
  const activities = page.getByRole('main').getByRole('listitem');
  await expect(activities).toHaveCount(3);
  await expect(page.getByText('adicionou um jogo à biblioteca')).toBeVisible();
  await expect(page.getByText('concluiu um jogo')).toBeVisible();
  await expect(page.getByText('publicou uma review')).toBeVisible();
  await expect(page.getByText('Uma escalada inesquecível.')).toBeVisible();
  await expect(page.getByText('4,5 / 5', { exact: true })).toBeVisible();
});

test('shows an empty feed when the player follows nobody', async ({
  page,
  signIn,
}) => {
  await signIn('Empty Feed Player');
  await page.goto('/feed');

  await expect(
    page.getByRole('heading', { name: 'Nenhuma atividade por enquanto' }),
  ).toBeVisible();
});
