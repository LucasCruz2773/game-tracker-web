import { describe, expect, it } from 'vitest';
import { createStaticPixPayload } from './pix';

describe('createStaticPixPayload', () => {
  it('creates a deterministic value-free Pix payload with a valid CRC', () => {
    expect(
      createStaticPixPayload({
        key: '7ce16d03-9999-4c11-b820-167d136d7167',
        merchantName: 'Lucas Fernandes Cruz',
        merchantCity: 'Poços de Caldas',
        description: 'Apoie o GameTrack',
      }),
    ).toBe(
      '00020126790014br.gov.bcb.pix01367ce16d03-9999-4c11-b820-167d136d71670217APOIE O GAMETRACK5204000053039865802BR5920LUCAS FERNANDES CRUZ6015POCOS DE CALDAS62070503***6304FDAF',
    );
  });

  it('does not include a transaction amount', () => {
    const payload = createStaticPixPayload({
      key: 'key',
      merchantName: 'Name',
      merchantCity: 'City',
    });

    expect(payload).not.toContain('540');
  });
});
