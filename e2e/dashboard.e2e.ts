import { expect, test } from './support/fixtures.ts';

test('shows library stats after tracking a few games', async ({
  page,
  signIn,
}) => {
  await signIn('Stats Player');
  await page.goto('/?q=celeste');
  await page.getByRole('heading', { name: 'Celeste', exact: true }).click();

  const panel = page.getByRole('region', { name: 'Minha biblioteca' });
  await panel.getByLabel('Status inicial').selectOption({ label: 'Jogando' });
  await panel.getByRole('button', { name: 'Adicionar' }).click();

  const rating = page.getByRole('radiogroup', { name: 'Sua nota' });
  await rating.getByRole('radio', { name: '4 estrelas', exact: true }).click();
  await page.getByRole('button', { name: 'Publicar avaliação' }).click();

  await page.goto('/profile/summary');
  await expect(page).toHaveURL('/profile/summary');

  await expect(page.getByText('Total de jogos')).toBeVisible();
  await expect(page.getByText('1', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('Jogando', { exact: true })).toBeVisible();
  await expect(page.getByText('4 / 5')).toBeVisible();
});

test('shows an empty state for a new user', async ({ page, signIn }) => {
  await signIn('Empty Stats');
  await page.goto('/dashboard');

  await expect(
    page.getByRole('heading', { name: 'Nada para resumir ainda' }),
  ).toBeVisible();
});
