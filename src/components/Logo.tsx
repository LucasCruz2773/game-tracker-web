interface LogoProps {
  large?: boolean;
}

export function Logo({ large = false }: LogoProps) {
  return (
    <span
      className={`inline-flex items-center font-black tracking-wider uppercase ${
        large ? 'gap-3 text-2xl' : 'gap-2.5 text-lg'
      }`}
    >
      <img
        src="/gametrack-logo.svg"
        alt=""
        width={large ? 56 : 36}
        height={large ? 56 : 36}
        className={`${large ? 'size-14' : 'size-9'} drop-shadow-[0_0_8px_rgba(245,0,34,0.28)]`}
      />
      <span>
        Game<span className="text-brand-500">Track</span>
      </span>
    </span>
  );
}
