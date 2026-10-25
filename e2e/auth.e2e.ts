import { expect, test } from './support/fixtures.ts';

test('sends visitors without a session to the Google sign-in page', async ({
  page,
}) => {
  await page.goto('/library');

  await expect(page).toHaveURL('/login');
  await expect(
    page.getByRole('link', { name: 'Entrar com Google' }),
  ).toHaveAttribute('href', '/api/auth/google');
});

test('explains why a Google sign-in failed', async ({ page }) => {
  await page.goto('/login?error=email_not_verified');

  await expect(page.getByRole('alert')).toContainText(
    'ainda não foi verificado',
  );
});

test('signs out and protects the app again', async ({ page, signIn }) => {
  const user = await signIn('Ana Souza');
  await page.goto('/');
  await expect(page.getByText(`@${user.username}`)).toBeVisible();

  await page.getByRole('button', { name: 'Sair' }).click();

  await expect(page).toHaveURL('/login');
  await page.goto('/');
  await expect(page).toHaveURL('/login');
});
