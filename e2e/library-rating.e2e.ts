import type { APIRequestContext } from '@playwright/test';
import type { SignedInTestUser } from './support/fixtures.ts';
import { expect, test } from './support/fixtures.ts';

interface GameSearchResponse {
  items: { id: string; title: string }[];
}

async function seedLibraryGame(
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
    headers: { Cookie: `${user.cookieName}=${user.token}` },
    data: { gameId: game!.id, status: 'PLAYING' },
  });
  expect(added.ok()).toBeTruthy();
}

test('previews, updates and removes a card rating without visual delay', async ({
  page,
  request,
  signIn,
}) => {
  const user = await signIn('Optimistic Rating Player');
  await seedLibraryGame(request, user);
  await page.goto('/profile/library');

  const card = page.getByRole('listitem').filter({ hasText: 'Celeste' });
  const rating = card.getByRole('radiogroup', { name: /Nota de Celeste/ });
  const pageTitle = page.getByRole('heading', { name: 'Minha biblioteca' });

  await rating.getByRole('radio', { name: '2 estrelas', exact: true }).hover();
  await expect(card.getByText('2 / 5', { exact: true })).toBeVisible();
  await pageTitle.hover();
  await expect(card.getByText('0 / 5', { exact: true })).toBeVisible();

  await page.route('**/api/games/*/reviews', async (route) => {
    if (route.request().method() === 'POST') {
      await new Promise((resolve) => setTimeout(resolve, 700));
    }
    await route.continue();
  });
  const created = page.waitForResponse(
    (response) =>
      response.request().method() === 'POST' &&
      /\/api\/games\/[^/]+\/reviews$/.test(response.url()),
  );
  await rating.getByRole('radio', { name: '4 estrelas', exact: true }).click();
  await expect(card.getByText('4 / 5', { exact: true })).toBeVisible({
    timeout: 250,
  });
  await created;

  await rating.getByRole('radio', { name: '2 estrelas', exact: true }).hover();
  await expect(card.getByText('2 / 5', { exact: true })).toBeVisible();
  await pageTitle.hover();
  await expect(card.getByText('4 / 5', { exact: true })).toBeVisible();

  await page.route('**/api/reviews/*', async (route) => {
    if (['PATCH', 'DELETE'].includes(route.request().method())) {
      await new Promise((resolve) => setTimeout(resolve, 700));
    }
    await route.continue();
  });
  const updated = page.waitForResponse(
    (response) => response.request().method() === 'PATCH',
  );
  await rating.getByRole('radio', { name: '2 estrelas', exact: true }).click();
  await expect(card.getByText('2 / 5', { exact: true })).toBeVisible({
    timeout: 250,
  });
  await updated;
  const twoStars = rating.getByRole('radio', {
    name: '2 estrelas',
    exact: true,
  });
  await expect(twoStars).toBeEnabled();
  await expect(card.getByText('2 / 5', { exact: true })).toBeVisible();

  const removed = page.waitForResponse(
    (response) =>
      response.request().method() === 'DELETE' &&
      /\/api\/reviews\/[^/]+$/.test(response.url()),
  );
  await twoStars.click();
  await expect(card.getByText('0 / 5', { exact: true })).toBeVisible({
    timeout: 250,
  });
  await removed;
  await expect(card.getByText('Remover nota')).toHaveCount(0);
});

test('orders the library from the highest rating to unrated games', async ({
  page,
  request,
  signIn,
}) => {
  const user = await signIn('Sorted Rating Player');
  const headers = { Cookie: `${user.cookieName}=${user.token}` };

  for (const [title, rating] of [
    ['Celeste', 6],
    ['Hades', 10],
    ['Hollow Knight', null],
  ] as const) {
    const search = await request.get(
      `/api/games?search=${encodeURIComponent(title)}&page=1&pageSize=20`,
    );
    const games = (await search.json()) as GameSearchResponse;
    const game = games.items.find((item) => item.title === title)!;
    const added = await request.post('/api/library', {
      headers,
      data: { gameId: game.id, status: 'PLAYING' },
    });
    expect(added.ok()).toBeTruthy();
    if (rating !== null) {
      const reviewed = await request.post(`/api/games/${game.id}/reviews`, {
        headers,
        data: { rating },
      });
      expect(reviewed.ok()).toBeTruthy();
    }
  }

  await page.goto('/profile/library');
  await page.getByLabel('Ordenar por').selectOption('rating');
  await expect(page).toHaveURL('/profile/library?sort=rating');

  const cards = page.getByRole('main').getByRole('listitem');
  await expect(cards).toHaveCount(3);
  await expect(cards.nth(0)).toContainText('Hades');
  await expect(cards.nth(1)).toContainText('Celeste');
  await expect(cards.nth(2)).toContainText('Hollow Knight');
});
