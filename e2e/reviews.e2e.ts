import { expect, test } from './support/fixtures.ts';

test('publishes, edits and deletes a game review', async ({ page, signIn }) => {
  await signIn('Review Tester');
  await page.goto('/?q=celeste');
  await page.getByRole('heading', { name: 'Celeste', exact: true }).click();

  const rating = page.getByRole('radiogroup', { name: 'Sua nota' });
  await rating
    .getByRole('radio', { name: '4,5 estrelas', exact: true })
    .click();
  await page
    .getByLabel('Sua avaliação')
    .fill('Plataforma desafiadora e emocionante.');
  await page.getByRole('button', { name: 'Publicar avaliação' }).click();
  await expect(page.getByText('Avaliação salva.')).toBeVisible();

  await rating.getByRole('radio', { name: '5 estrelas', exact: true }).click();
  await page.getByLabel('Sua avaliação').fill('Ainda melhor na segunda run.');
  await page.getByRole('button', { name: 'Salvar avaliação' }).click();
  await expect(page.getByText('Avaliação salva.')).toBeVisible();
  await expect(page.getByText('Ainda melhor na segunda run.')).toBeVisible();

  await page.getByRole('button', { name: 'Excluir' }).click();
  await page.getByRole('button', { name: 'Sim, excluir' }).click();
  await expect(
    page.getByRole('button', { name: 'Publicar avaliação' }),
  ).toBeVisible();
});
