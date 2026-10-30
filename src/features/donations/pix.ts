interface StaticPixInput {
  key: string;
  merchantName: string;
  merchantCity: string;
  description?: string;
}

function field(id: string, value: string): string {
  return `${id}${String(value.length).padStart(2, '0')}${value}`;
}

function pixText(value: string, maxLength: number): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9 $%*+\-./:]/g, '')
    .slice(0, maxLength);
}

function crc16(payload: string): string {
  let crc = 0xffff;
  for (let index = 0; index < payload.length; index += 1) {
    crc ^= payload.charCodeAt(index) << 8;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc & 0x8000) !== 0 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

export function createStaticPixPayload({
  key,
  merchantName,
  merchantCity,
  description,
}: StaticPixInput): string {
  const merchantAccount =
    field('00', 'br.gov.bcb.pix') +
    field('01', key) +
    (description ? field('02', pixText(description, 72)) : '');
  const payload =
    field('00', '01') +
    field('26', merchantAccount) +
    field('52', '0000') +
    field('53', '986') +
    field('58', 'BR') +
    field('59', pixText(merchantName, 25)) +
    field('60', pixText(merchantCity, 15)) +
    field('62', field('05', '***')) +
    '6304';

  return payload + crc16(payload);
}
