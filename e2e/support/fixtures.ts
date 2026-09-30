import { test as base } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { API_DIR } from './e2e-config.ts';

interface CreatedSession {
  userId: string;
  cookieName: string;
  token: string;
}

interface E2eFixtures {
  /** Signs a brand-new user in, standing in for the Google redirect flow. */
  signIn: (displayName: string) => Promise<void>;
}

export const test = base.extend<E2eFixtures>({
  signIn: async ({ context, baseURL }, use) => {
    await use(async (displayName) => {
      // A fresh user per test keeps libraries from leaking between tests.
      const username = `player_${randomBytes(4).toString('hex')}`;
      const output = execFileSync(
        process.execPath,
        ['scripts/e2e/create-session.mjs', username, displayName],
        { cwd: API_DIR, encoding: 'utf8' },
      );
      const session = JSON.parse(output) as CreatedSession;

      await context.addCookies([
        {
          name: session.cookieName,
          value: session.token,
          url: baseURL,
          httpOnly: true,
          sameSite: 'Lax',
        },
      ]);
    });
  },
});

export { expect } from '@playwright/test';
