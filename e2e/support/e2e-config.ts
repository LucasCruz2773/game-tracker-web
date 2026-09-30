import path from 'node:path';

/**
 * Ports used only by the e2e stack, so it can run next to the dev servers
 * (away from 5174+, where Vite falls back when 5173 is taken).
 */
export const WEB_PORT = 5199;
export const API_PORT = 3100;
export const FAKE_RAWG_PORT = 3200;

/** The API repository is expected next to this one unless told otherwise. */
export const API_DIR = path.resolve(
  import.meta.dirname,
  '../..',
  process.env.GAMETRACK_API_DIR ?? '../game-tracker-api',
);
