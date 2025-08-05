
import { useState, useEffect } from 'react';
import { onAuthChange, type User } from '@/lib/auth';
import { useRouter, usePathname } from 'next/navigation';

const AUTH_ROUTES = ['/login', '/register', '/forgot-password'];
const PUBLIC_ROUTES = ['/privacy-policy', '/terms-of-service', '/contact'];

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) {
      return;
    };

    const isAuthRoute = AUTH_ROUTES.includes(pathname);
    const isPublicRoute = PUBLIC_ROUTES.includes(pathname) || pathname === '/';

    if (user && isAuthRoute) {
      router.replace('/dashboard');
    } else if (!user && !isAuthRoute && !isPublicRoute) {
      router.replace('/login');
    }
  }, [user, loading, pathname, router]);

  return { user, loading };
}
