import { Spinner } from './Spinner';
import { Logo } from './Logo';

export function LoadingScreen() {
  return (
    <div className="retro-grid flex min-h-screen items-center justify-center p-6">
      <div className="retro-panel pixel-corners w-full max-w-sm p-8 text-center">
        <div className="flex justify-center">
          <Logo large />
        </div>
        <p className="retro-kicker mt-6">System boot // Please wait</p>
        <div className="mt-6 border-y border-zinc-700 py-5">
          <Spinner label="Carregando dados…" />
        </div>
        <div
          aria-hidden="true"
          className="mt-5 flex items-center justify-between text-[0.65rem] tracking-widest text-zinc-500 uppercase"
        >
          <span>Memory OK</span>
          <span className="text-emerald-400">● Online</span>
        </div>
      </div>
    </div>
  );
}
