import { isApiError } from '../../lib/api-client';

export function catalogErrorDescription(error: unknown): string {
  if (isApiError(error, 429)) {
    return 'Muitas buscas em pouco tempo. Aguarde um instante e tente de novo.';
  }
  if (isApiError(error, 502)) {
    return 'O catálogo de jogos está indisponível no momento.';
  }
  return 'Verifique sua conexão e tente novamente.';
}
