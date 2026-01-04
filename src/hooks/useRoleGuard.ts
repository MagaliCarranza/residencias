// src/hooks/useRoleGuard.ts
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

export function useRoleGuard(allowedRoles: string[]) {
  const { user, userData, loading, isRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Si terminó de cargar y no hay usuario, directo al login
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    // Si hay usuario pero no tiene el rol permitido, a unauthorized
    if (!loading && user && userData) {
      const hasPermission = allowedRoles.some(role => isRole(role));
      if (!hasPermission) {
        router.push('/unauthorized');
      }
    }
  }, [user, userData, loading, router, allowedRoles, isRole]);

  return { loading: loading || !userData, userData };
}