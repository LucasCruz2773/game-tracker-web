import type { Page } from '@playwright/test';
import { expect, test } from './support/fixtures.ts';

function todayInBrowser(page: Page): Promise<string> {
  return page.evaluate(() => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${now.getFullYear()}-${month}-${day}`;
  });
}

test('finds a game, adds it to the library and tracks its progress', async ({
  page,
  signIn,
}) => {
  await signIn('Lucas Fernandes');

  // Search the catalog and open the game.
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Jogos populares' }),
  ).toBeVisible();
  await page.getByRole('searchbox', { name: 'Buscar jogos' }).fill('hollow');
  await page.getByRole('button', { name: 'Buscar' }).click();

  await expect(page).toHaveURL('/?q=hollow');
  const results = page.getByRole('main').getByRole('listitem');
  await expect(results).toHaveCount(2);
  await page
    .getByRole('heading', { name: 'Hollow Knight', exact: true })
    .click();

  // Game details.
  await expect(
    page.getByRole('heading', { level: 1, name: 'Hollow Knight' }),
  ).toBeVisible();
  await expect(
    page.getByText('Forge your own path in Hollow Knight!'),
  ).toBeVisible();
  await expect(page.getByText('Lançamento: 24 de fev.')).toBeVisible();

  // Add it as currently playing: the start date defaults to the local today.
  const panel = page.getByRole('region', { name: 'Minha biblioteca' });
  await panel.getByLabel('Status inicial').selectOption({ label: 'Jogando' });
  await panel.getByRole('button', { name: 'Adicionar' }).click();

  await expect(
    panel.getByText('Jogando', { exact: true }).first(),
  ).toBeVisible();
  await expect(panel.getByLabel('Começou em')).toHaveValue(
    await todayInBrowser(page),
  );

  await panel.getByLabel('Horas jogadas').fill('12');
  await panel.getByRole('button', { name: 'Salvar alterações' }).click();
  await expect(panel.getByText('Alterações salvas.')).toBeVisible();

  // The library lists it, and the status can be changed from there.
  await page
    .getByRole('link', { name: 'Minha biblioteca', exact: true })
    .click();
  await expect(page).toHaveURL('/library');
  const entry = page.getByRole('listitem').filter({ hasText: 'Hollow Knight' });
  await expect(entry).toContainText('12 h jogadas');

  await entry
    .getByLabel('Status de Hollow Knight')
    .selectOption({ label: 'Concluído' });
  await expect(entry).toContainText('Concluiu em');

  await page.getByRole('button', { name: 'Concluído' }).click();
  await expect(page).toHaveURL('/library?status=COMPLETED');
  await expect(entry).toBeVisible();

  await page.getByRole('button', { name: 'Jogando' }).click();
  await expect(
    page.getByRole('heading', { name: 'Nenhum jogo em “Jogando”' }),
  ).toBeVisible();
});

test('shows an empty library to a new user', async ({ page, signIn }) => {
  await signIn('Nova Jogadora');
  await page.goto('/library');

  await expect(
    page.getByRole('heading', { name: 'Sua biblioteca está vazia' }),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Explorar jogos' }).click();
  await expect(page).toHaveURL('/');
});

test('removes a game from the library', async ({ page, signIn }) => {
  await signIn('Carla Dias');
  await page.goto('/?q=celeste');
  await page.getByRole('heading', { name: 'Celeste', exact: true }).click();

  const panel = page.getByRole('region', { name: 'Minha biblioteca' });
  await panel.getByRole('button', { name: 'Adicionar' }).click();
  await panel.getByRole('button', { name: 'Remover' }).click();
  await panel.getByRole('button', { name: 'Sim, remover' }).click();

  await expect(
    panel.getByText('Este jogo ainda não está na sua biblioteca.'),
  ).toBeVisible();
});
