import { useI18n } from '../i18n/i18n';
import { PixDonationCard } from '../features/donations/components/PixDonationCard';

const PORTFOLIO_URL = 'https://portifolio-rosy-sigma-62.vercel.app/';

export function ContactPage() {
  const { t } = useI18n();

  return (
    <section className="space-y-6">
      <header className="retro-panel retro-screen overflow-hidden rounded-xl">
        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(17rem,0.8fr)] lg:p-10">
          <div>
            <p className="retro-kicker">Developer profile // Player 01</p>
            <h1 className="retro-title mt-3 text-3xl leading-tight font-black sm:text-5xl">
              {t('contactTitle')}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-300 sm:text-lg">
              {t('contactIntroduction')}
            </p>
            <p className="mt-4 max-w-2xl leading-relaxed text-zinc-400">
              {t('contactLearning')}
            </p>
          </div>

          <div className="pixel-corners flex flex-col justify-between border border-zinc-600 bg-black/30 p-5">
            <div>
              <p className="retro-kicker">Tech stack</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {[
                  'React',
                  'Next.js',
                  'TypeScript',
                  'Node.js',
                  'NestJS',
                  'Python',
                  'PostgreSQL',
                  'Tailwind',
                ].map((technology) => (
                  <li
                    key={technology}
                    className="border border-zinc-600 bg-zinc-900/80 px-2.5 py-1 text-sm text-zinc-200"
                  >
                    {technology}
                  </li>
                ))}
              </ul>
            </div>
            <p className="mt-8 text-sm tracking-wider text-emerald-400 uppercase">
              São Paulo · BR
            </p>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <article className="retro-panel rounded-xl p-6 sm:p-8">
          <p className="retro-kicker">Portfolio // Selected work</p>
          <h2 className="mt-3 text-2xl font-black tracking-wide uppercase">
            {t('portfolioTitle')}
          </h2>
          <p className="mt-4 leading-relaxed text-zinc-700">
            {t('portfolioDescription')}
          </p>
          <a
            href={PORTFOLIO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="pixel-corners mt-6 inline-flex items-center gap-2 border border-brand-700 bg-brand-600 px-5 py-3 font-bold tracking-wide text-white uppercase shadow-[3px_3px_0_#05060a] transition hover:bg-brand-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          >
            {t('visitPortfolio')}
            <span aria-hidden="true">↗</span>
          </a>
        </article>

        <article className="retro-panel rounded-xl p-6 sm:p-8">
          <p className="retro-kicker">Communication link // Online</p>
          <h2 className="mt-3 text-2xl font-black tracking-wide uppercase">
            {t('letsTalk')}
          </h2>
          <p className="mt-4 leading-relaxed text-zinc-700">
            {t('contactInvitation')}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ContactLink href="mailto:lucascruz2773@gmail.com" label="E-mail" />
            <ContactLink
              href="https://www.linkedin.com/in/lucascruz2773"
              label="LinkedIn"
            />
            <ContactLink
              href="https://github.com/LucasCruz2773"
              label="GitHub"
            />
          </div>
        </article>
      </div>

      <PixDonationCard />
    </section>
  );
}

function ContactLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target={href.startsWith('mailto:') ? undefined : '_blank'}
      rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
      className="pixel-corners border border-zinc-600 px-4 py-2 font-bold tracking-wide uppercase hover:border-brand-500 hover:text-brand-500 focus-visible:outline-2 focus-visible:outline-brand-500"
    >
      {label} ↗
    </a>
  );
}
