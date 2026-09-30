import { Spinner } from './Spinner';

export function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner />
    </div>
  );
}
