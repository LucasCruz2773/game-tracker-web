import QRCode from 'qrcode';
import { useEffect, useState } from 'react';
import { useI18n } from '../../../i18n/i18n';
import { createStaticPixPayload } from '../pix';

const PIX_PAYLOAD = createStaticPixPayload({
  key: '7ce16d03-9999-4c11-b820-167d136d7167',
  merchantName: 'Lucas Fernandes Cruz',
  merchantCity: 'Poços de Caldas',
  description: 'Apoie o GameTrack',
});

export function PixDonationCard() {
  const { t } = useI18n();
  const [qrCode, setQrCode] = useState<string>();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    void QRCode.toDataURL(PIX_PAYLOAD, {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 320,
      color: { dark: '#09090b', light: '#ffffff' },
    }).then((dataUrl) => {
      if (active) setQrCode(dataUrl);
    });
    return () => {
      active = false;
    };
  }, []);

  async function copyPix() {
    await navigator.clipboard.writeText(PIX_PAYLOAD);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2_000);
  }

  return (
    <article className="retro-panel rounded-xl p-6 sm:p-8">
      <div className="grid items-center gap-8 md:grid-cols-[minmax(13rem,0.65fr)_minmax(0,1.35fr)]">
        <div className="mx-auto w-full max-w-64">
          {qrCode ? (
            <img
              src={qrCode}
              alt={t('pixQrCodeAlt')}
              className="pixel-corners aspect-square w-full bg-white p-2 shadow-[5px_5px_0_#05060a]"
            />
          ) : (
            <div className="pixel-corners aspect-square w-full animate-pulse bg-zinc-200" />
          )}
        </div>

        <div>
          <p className="retro-kicker">Support link // Pix</p>
          <h2 className="mt-3 text-2xl font-black tracking-wide uppercase">
            {t('supportProject')}
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-zinc-700">
            {t('supportDescription')}
          </p>
          <p className="mt-3 text-sm font-bold text-emerald-600">
            {t('freeAmount')}
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <input
              readOnly
              value={PIX_PAYLOAD}
              aria-label={t('pixCopyPaste')}
              className="console-input min-w-0 flex-1 rounded-lg border px-3 py-2 font-mono text-xs"
              onFocus={(event) => event.currentTarget.select()}
            />
            <button
              type="button"
              onClick={() => void copyPix()}
              className="theme-primary-button rounded-lg border px-5 py-2 text-sm font-bold tracking-wide uppercase"
            >
              {copied ? t('pixCopied') : t('copyPix')}
            </button>
          </div>
          <p aria-live="polite" className="mt-3 text-xs text-zinc-700">
            {copied ? t('pixCopiedConfirmation') : t('pixInstructions')}
          </p>
        </div>
      </div>
    </article>
  );
}
