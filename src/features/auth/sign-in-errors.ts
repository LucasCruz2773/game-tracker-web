import type { GoogleSignInErrorReason } from './auth.types';

const SIGN_IN_ERROR_MESSAGES: Record<GoogleSignInErrorReason, string> = {
  cancelled: 'O login com o Google foi cancelado.',
  invalid_state: 'Sua tentativa de login expirou. Tente novamente.',
  google_rejected: 'O Google não confirmou seu login. Tente novamente.',
  email_not_verified:
    'O e-mail da sua conta Google ainda não foi verificado. Verifique-o e tente novamente.',
  account_conflict:
    'Este e-mail já está vinculado a outra conta Google no GameTrack.',
  unexpected_error: 'Algo deu errado ao entrar. Tente novamente em instantes.',
};

export function signInErrorMessage(reason: string | null): string | null {
  if (reason === null) {
    return null;
  }

  return Object.hasOwn(SIGN_IN_ERROR_MESSAGES, reason)
    ? SIGN_IN_ERROR_MESSAGES[reason as GoogleSignInErrorReason]
    : SIGN_IN_ERROR_MESSAGES.unexpected_error;
}
