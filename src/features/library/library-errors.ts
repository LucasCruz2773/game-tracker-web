import { isApiError } from '../../lib/api-client';

export function libraryErrorMessage(error: unknown): string {
  if (isApiError(error, 409)) {
    return 'Este jogo já está na sua biblioteca.';
  }
  if (isApiError(error, 404)) {
    return 'Este jogo não foi encontrado.';
  }
  if (isApiError(error, 400) || isApiError(error, 422)) {
    return 'Alguns dados são inválidos. Confira as datas e as horas jogadas.';
  }
  return 'Não foi possível salvar. Tente novamente.';
}
