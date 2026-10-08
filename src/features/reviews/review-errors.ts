import { isApiError } from '../../lib/api-client';

export function reviewErrorMessage(error: unknown): string {
  if (isApiError(error, 409)) {
    return 'Você já avaliou este jogo.';
  }
  if (isApiError(error, 400) || isApiError(error, 422)) {
    return 'Confira a nota e o texto da avaliação.';
  }
  return 'Não foi possível salvar. Tente novamente.';
}
