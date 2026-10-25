import { Navigate, useLocation } from 'react-router';

interface LegacyProfileRedirectProps {
  to: string;
}

export function LegacyProfileRedirect({ to }: LegacyProfileRedirectProps) {
  const { search } = useLocation();
  return <Navigate to={`${to}${search}`} replace />;
}
